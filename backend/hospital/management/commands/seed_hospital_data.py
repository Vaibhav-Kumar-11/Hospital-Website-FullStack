from django.core.management.base import BaseCommand
from django.utils.text import slugify

from hospital.models import Department, Doctor

# Each department: name, short icon/keyword, description, and its doctors.
# Doctor tuple: (name, specialty, bio, years_experience, rating)
DEPARTMENTS_DATA = [
    {
        'name': 'General Medicine',
        'icon': 'stethoscope',
        'description': 'Comprehensive care for everyday illnesses, checkups, and chronic condition management.',
        'doctors': [
            (
                'Dr. Ramesh Iyer', 'Internal Medicine',
                'Dr. Iyer has spent over a decade helping patients manage everything from '
                'seasonal infections to long-term chronic conditions. He believes in clear, '
                'unhurried consultations.',
                14, 4.7,
            ),
            (
                'Dr. Anjali Deshmukh', 'Family Medicine',
                'Dr. Deshmukh focuses on preventive care and whole-family health, with a '
                'special interest in lifestyle-related illnesses.',
                9, 4.5,
            ),
        ],
    },
    {
        'name': 'Cardiology',
        'icon': 'heart',
        'description': 'Diagnosis and treatment of heart and blood vessel conditions.',
        'doctors': [
            (
                'Dr. Vikram Nair', 'Interventional Cardiology',
                'Dr. Nair specializes in angioplasty and minimally invasive cardiac '
                'procedures, with a strong track record in emergency cardiac care.',
                16, 4.8,
            ),
            (
                'Dr. Sunita Rao', 'Cardiac Electrophysiology',
                'Dr. Rao treats irregular heart rhythms and has trained extensively in '
                'pacemaker and device management.',
                11, 4.6,
            ),
        ],
    },
    {
        'name': 'Dermatology',
        'icon': 'sparkles',
        'description': 'Skin, hair, and nail care for all ages, from acne to advanced dermatologic conditions.',
        'doctors': [
            (
                'Dr. Priya Menon', 'Cosmetic Dermatology',
                'Dr. Menon combines clinical dermatology with cosmetic procedures, and is '
                'known for a patient-first, no-pressure approach.',
                8, 4.6,
            ),
        ],
    },
    {
        'name': 'Dentistry',
        'icon': 'tooth',
        'description': 'General and cosmetic dental care, from routine cleanings to root canals.',
        'doctors': [
            (
                'Dr. Arjun Kapoor', 'General Dentistry',
                'Dr. Kapoor has treated thousands of patients for routine and emergency '
                'dental needs and is known for a gentle chairside manner.',
                12, 4.5,
            ),
            (
                'Dr. Neha Bhatt', 'Orthodontics',
                'Dr. Bhatt specializes in braces and aligners for both teenagers and adults.',
                7, 4.4,
            ),
        ],
    },
    {
        'name': 'Orthopedics',
        'icon': 'bone',
        'description': 'Care for bones, joints, ligaments, and muscles, including sports injuries.',
        'doctors': [
            (
                'Dr. Sanjay Verma', 'Joint Replacement Surgery',
                'Dr. Verma has performed hundreds of knee and hip replacement surgeries '
                'and is active in post-operative rehabilitation planning.',
                18, 4.7,
            ),
        ],
    },
    {
        'name': 'Ophthalmology',
        'icon': 'eye',
        'description': 'Eye examinations, vision correction, and treatment of eye diseases.',
        'doctors': [
            (
                'Dr. Kavita Joshi', 'Cataract & Refractive Surgery',
                'Dr. Joshi has helped restore vision for patients across age groups '
                'through cataract surgery and LASIK procedures.',
                13, 4.6,
            ),
        ],
    },
    {
        'name': 'Pediatrics',
        'icon': 'baby',
        'description': 'Medical care for infants, children, and adolescents.',
        'doctors': [
            (
                'Dr. Meera Pillai', 'Pediatric Medicine',
                'Dr. Pillai has a gentle, reassuring approach that puts both children and '
                'worried parents at ease.',
                10, 4.8,
            ),
            (
                'Dr. Rohit Malhotra', 'Neonatology',
                'Dr. Malhotra specializes in the care of newborns, including premature and '
                'critically ill infants.',
                15, 4.7,
            ),
        ],
    },
    {
        'name': 'Gynecology',
        'icon': 'ribbon',
        'description': "Women's reproductive health, prenatal care, and gynecological surgery.",
        'doctors': [
            (
                'Dr. Shalini Reddy', "Obstetrics & Gynecology",
                'Dr. Reddy has guided hundreds of families through pregnancy and delivery '
                'with a calm, evidence-based approach.',
                12, 4.7,
            ),
        ],
    },
    {
        'name': 'Psychiatry',
        'icon': 'brain',
        'description': 'Mental health assessment, therapy referrals, and psychiatric treatment.',
        'doctors': [
            (
                'Dr. Arvind Chandra', 'Adult Psychiatry',
                'Dr. Chandra treats anxiety, depression, and stress-related conditions with '
                'a focus on practical, sustainable treatment plans.',
                9, 4.5,
            ),
        ],
    },
    {
        'name': 'ENT',
        'icon': 'ear',
        'description': 'Diagnosis and treatment of ear, nose, and throat conditions.',
        'doctors': [
            (
                'Dr. Deepak Suresh', 'Otolaryngology',
                'Dr. Suresh treats chronic sinus issues, hearing concerns, and throat '
                'infections for patients of all ages.',
                11, 4.4,
            ),
        ],
    },
]


class Command(BaseCommand):
    help = 'Seeds the database with hospital departments and doctors (idempotent).'

    def handle(self, *args, **options):
        total_departments = 0
        total_doctors = 0

        for dept_data in DEPARTMENTS_DATA:
            slug = slugify(dept_data['name'])
            department, created = Department.objects.get_or_create(
                slug=slug,
                defaults={
                    'name': dept_data['name'],
                    'description': dept_data['description'],
                    'icon': dept_data['icon'],
                },
            )
            if created:
                total_departments += 1
                self.stdout.write(self.style.SUCCESS(f'Created department: {department.name}'))
            else:
                self.stdout.write(f'Department already exists: {department.name}')

            for doctor_tuple in dept_data['doctors']:
                name, specialty, bio, years_experience, rating = doctor_tuple
                doctor, created = Doctor.objects.get_or_create(
                    name=name,
                    department=department,
                    defaults={
                        'specialty': specialty,
                        'bio': bio,
                        'years_experience': years_experience,
                        'rating': rating,
                    },
                )
                if created:
                    total_doctors += 1
                    self.stdout.write(self.style.SUCCESS(f'  Created doctor: {doctor.name}'))
                else:
                    self.stdout.write(f'  Doctor already exists: {doctor.name}')

        self.stdout.write(self.style.SUCCESS(
            f'\nSeeding complete. {total_departments} new departments, {total_doctors} new doctors.'
        ))
