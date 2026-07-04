from django.contrib import admin

from .models import Appointment, Department, Doctor


@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'icon')
    search_fields = ('name', 'slug')
    prepopulated_fields = {'slug': ('name',)}


@admin.register(Doctor)
class DoctorAdmin(admin.ModelAdmin):
    list_display = ('name', 'department', 'specialty', 'years_experience', 'rating')
    list_filter = ('department',)
    search_fields = ('name', 'specialty')


@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    # This admin panel IS the staff dashboard for MediGuide -- there is no
    # separate custom staff UI by design. Staff manage doctors and view/
    # edit appointments entirely from here.
    list_display = ('patient', 'doctor', 'date', 'time_slot', 'status', 'created_at')
    list_filter = ('status', 'date', 'doctor__department')
    search_fields = ('patient__username', 'doctor__name')
