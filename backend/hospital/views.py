from datetime import datetime

from django.db import IntegrityError
from django.shortcuts import get_object_or_404
from rest_framework import generics, permissions, status
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import TIME_SLOTS, Appointment, Department, Doctor
from .serializers import (
    AppointmentSerializer,
    DepartmentSerializer,
    DoctorSerializer,
    RegisterSerializer,
)


class RegisterView(generics.CreateAPIView):
    """POST /api/auth/register/ -- create a Django User."""
    permission_classes = [permissions.AllowAny]
    serializer_class = RegisterSerializer


class DepartmentListView(generics.ListAPIView):
    """GET /api/departments/ -- public, list all departments."""
    permission_classes = [permissions.AllowAny]
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer


class DepartmentDetailView(generics.RetrieveAPIView):
    """GET /api/departments/<slug>/ -- public, single department by slug."""
    permission_classes = [permissions.AllowAny]
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer
    lookup_field = 'slug'


class DoctorListView(generics.ListAPIView):
    """GET /api/doctors/ -- public, list all, supports ?department=<slug>."""
    permission_classes = [permissions.AllowAny]
    serializer_class = DoctorSerializer

    def get_queryset(self):
        queryset = Doctor.objects.all()
        department_slug = self.request.query_params.get('department')
        if department_slug:
            queryset = queryset.filter(department__slug=department_slug)
        return queryset


class DoctorDetailView(generics.RetrieveAPIView):
    """GET /api/doctors/<id>/ -- public, single doctor."""
    permission_classes = [permissions.AllowAny]
    queryset = Doctor.objects.all()
    serializer_class = DoctorSerializer


class AvailableSlotsView(APIView):
    """
    GET /api/doctors/<id>/available-slots/?date=YYYY-MM-DD
    Public. Returns {"slots": [...]} of time_slot values NOT already
    booked (status='scheduled') for that doctor on that date.
    """
    permission_classes = [permissions.AllowAny]

    def get(self, request, pk):
        doctor = get_object_or_404(Doctor, pk=pk)

        date_param = request.query_params.get('date')
        if not date_param:
            return Response({'detail': 'date query parameter is required.'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            parsed_date = datetime.strptime(date_param, '%Y-%m-%d').date()
        except ValueError:
            return Response({'detail': 'date must be in YYYY-MM-DD format.'}, status=status.HTTP_400_BAD_REQUEST)

        booked_slots = set(
            Appointment.objects.filter(
                doctor=doctor, date=parsed_date, status='scheduled',
            ).values_list('time_slot', flat=True)
        )
        all_slot_values = [value for value, _label in TIME_SLOTS]
        available = [slot for slot in all_slot_values if slot not in booked_slots]
        return Response({'slots': available})


class AppointmentListCreateView(generics.ListCreateAPIView):
    """
    GET /api/appointments/ -- auth required, returns only request.user's own.
    POST /api/appointments/ -- auth required, creates an appointment owned
    by request.user (any patient/owner field from the client is ignored).
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = AppointmentSerializer

    def get_queryset(self):
        return Appointment.objects.filter(patient=self.request.user).order_by('-date', '-time_slot')

    def perform_create(self, serializer):
        # The serializer's validate() already does a friendly pre-check, but
        # under a genuine race (two requests slipping past it at once) the
        # database's conditional unique constraint is the real guarantee --
        # it will raise IntegrityError, which we turn into a clean 400
        # instead of letting it bubble up as a 500.
        try:
            serializer.save(patient=self.request.user)
        except IntegrityError:
            raise ValidationError({'non_field_errors': ['This slot is no longer available.']})


class AppointmentDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET/PATCH/DELETE /api/appointments/<id>/ -- auth + ownership required.
    Queryset is filtered to the current user so another user's appointment
    is never leaked (looks like a plain 404, not a 403, to avoid revealing
    that the row exists at all).
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = AppointmentSerializer

    def get_queryset(self):
        return Appointment.objects.filter(patient=self.request.user)
