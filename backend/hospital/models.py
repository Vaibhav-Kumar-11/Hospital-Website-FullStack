from django.contrib.auth.models import User
from django.db import models

# Half-hour appointment slots the hospital offers per day.
# value = 24-hour 'HH:MM' stored in the DB, label = human-friendly display.
TIME_SLOTS = [
    ('09:00', '09:00 AM'),
    ('09:30', '09:30 AM'),
    ('10:00', '10:00 AM'),
    ('10:30', '10:30 AM'),
    ('11:00', '11:00 AM'),
    ('11:30', '11:30 AM'),
    ('12:00', '12:00 PM'),
    ('14:00', '02:00 PM'),
    ('14:30', '02:30 PM'),
    ('15:00', '03:00 PM'),
    ('15:30', '03:30 PM'),
    ('16:00', '04:00 PM'),
    ('16:30', '04:30 PM'),
    ('17:00', '05:00 PM'),
]


class Department(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    description = models.TextField()
    icon = models.CharField(max_length=50, blank=True)

    def __str__(self):
        return self.name


class Doctor(models.Model):
    name = models.CharField(max_length=100)
    department = models.ForeignKey(Department, on_delete=models.CASCADE, related_name='doctors')
    specialty = models.CharField(max_length=150)
    bio = models.TextField(blank=True)
    years_experience = models.PositiveIntegerField(default=0)
    # Seeded/static display rating -- not patient-editable. No endpoint
    # should ever accept this field as writable input from a client.
    rating = models.DecimalField(max_digits=2, decimal_places=1, default=4.5)

    def __str__(self):
        return f'Dr. {self.name} ({self.specialty})'


class Appointment(models.Model):
    STATUS_CHOICES = [
        ('scheduled', 'Scheduled'),
        ('cancelled', 'Cancelled'),
        ('completed', 'Completed'),
    ]

    patient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='appointments')
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name='appointments')
    date = models.DateField()
    time_slot = models.CharField(max_length=5, choices=TIME_SLOTS)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='scheduled')
    # Free text from the patient describing symptoms. Purely informational
    # for the doctor to read -- no booking logic depends on its contents.
    symptom_note = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            # The core booking-integrity guarantee of the whole project:
            # a cancelled appointment frees its slot (since the condition
            # only applies to status='scheduled'), but two *active*
            # appointments for the same doctor/date/slot can never coexist,
            # even under concurrent requests -- enforced at the DB level.
            models.UniqueConstraint(
                fields=['doctor', 'date', 'time_slot'],
                condition=models.Q(status='scheduled'),
                name='unique_active_doctor_slot',
            )
        ]

    def __str__(self):
        return f'{self.patient.username} with Dr. {self.doctor.name} on {self.date} {self.time_slot}'
