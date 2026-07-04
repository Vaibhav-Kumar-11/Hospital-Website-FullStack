from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from . import views

urlpatterns = [
    # Auth
    path('auth/register/', views.RegisterView.as_view(), name='auth-register'),
    path('auth/login/', TokenObtainPairView.as_view(), name='auth-login'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='auth-refresh'),

    # Departments
    path('departments/', views.DepartmentListView.as_view(), name='department-list'),
    path('departments/<slug:slug>/', views.DepartmentDetailView.as_view(), name='department-detail'),

    # Doctors
    path('doctors/', views.DoctorListView.as_view(), name='doctor-list'),
    path('doctors/<int:pk>/', views.DoctorDetailView.as_view(), name='doctor-detail'),
    path('doctors/<int:pk>/available-slots/', views.AvailableSlotsView.as_view(), name='doctor-available-slots'),

    # Appointments
    path('appointments/', views.AppointmentListCreateView.as_view(), name='appointment-list-create'),
    path('appointments/<int:pk>/', views.AppointmentDetailView.as_view(), name='appointment-detail'),
]
