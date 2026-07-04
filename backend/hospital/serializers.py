from datetime import date as date_cls

from django.contrib.auth.models import User
from rest_framework import serializers

from .models import Appointment, Department, Doctor


class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = '__all__'


class DoctorSerializer(serializers.ModelSerializer):
    department_name = serializers.CharField(source='department.name', read_only=True)

    class Meta:
        model = Doctor
        fields = [
            'id', 'name', 'department', 'department_name', 'specialty',
            'bio', 'years_experience', 'rating',
        ]
        # rating is a seeded/static display value -- never writable by a client.
        read_only_fields = ['rating']


class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'password', 'email']
        extra_kwargs = {
            'password': {'write_only': True},
            'email': {'required': False},
        }

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password'],
        )
        return user


class AppointmentSerializer(serializers.ModelSerializer):
    doctor_name = serializers.CharField(source='doctor.name', read_only=True)
    department_name = serializers.CharField(source='doctor.department.name', read_only=True)

    class Meta:
        model = Appointment
        fields = [
            'id', 'doctor', 'doctor_name', 'department_name', 'date',
            'time_slot', 'status', 'symptom_note', 'created_at',
        ]
        # patient is intentionally NOT a field here -- it is always set
        # from request.user in the view, never trusted from client input.
        # DRF auto-generates a UniqueTogetherValidator from the model's
        # conditional UniqueConstraint, which would raise its own generic
        # "must make a unique set" error before our friendlier check below
        # runs. We disable that auto-validator and do the availability
        # check ourselves in validate() instead. The DB constraint itself
        # is untouched and still guarantees integrity at the database level.
        validators = []

    def validate_date(self, value):
        if value < date_cls.today():
            raise serializers.ValidationError('Appointment date cannot be in the past.')
        return value

    def validate(self, attrs):
        # Friendly pre-check only -- the DB's conditional unique constraint
        # is the real guarantee against race conditions.
        doctor = attrs.get('doctor')
        date = attrs.get('date')
        time_slot = attrs.get('time_slot')
        if doctor and date and time_slot:
            already_booked = Appointment.objects.filter(
                doctor=doctor, date=date, time_slot=time_slot, status='scheduled',
            ).exists()
            if already_booked:
                raise serializers.ValidationError('This slot is no longer available.')
        return attrs
