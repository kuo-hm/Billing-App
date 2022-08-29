from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.db import models
from django.forms import ValidationError


def get_profile(self, filename):
    return f'media/image/profile/{self.pk}/{"profile_image.png"}'


def get_default_profile():
    return "media/image/profile/default-profile-pic.jpg"


class MyAccountManager(BaseUserManager):
    def create_user(self, email, username, password=None):
        if not email:
            raise ValueError("User must have a username")
        if not username:
            raise ValueError("User must have a username")
        user = self.model(
            email=self.normalize_email(email),
            username=username,
        )
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, username, password):
        user = self.create_user(
            email=self.normalize_email(email),
            username=username,
            password=password,
        )
        user.is_admin = True
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return user


class Account(AbstractBaseUser):
    email = models.EmailField(verbose_name="email", max_length=60, unique=True)
    username = models.CharField(max_length=30, unique=False)
    full_name = models.CharField(max_length=200, unique=False)
    date_joined = models.DateTimeField(
        verbose_name='date joined', auto_now_add=True)
    is_admin = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    customer_detail=models.ForeignKey('Customer', on_delete=models.CASCADE, null=True, blank=True)
    objects = MyAccountManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.username

    def has_perm(self, perm, obj=None):
        return self.is_admin

    def get_profile_image_filename(self):
        return str(self.profile_image)[str(self.profile_image).index(f'media/image/profile/{self.pk}/'):]

    def has_module_perms(self, app_label):
        return True


class Customer(models.Model):
    customer_data=models.OneToOneField(Account, on_delete=models.CASCADE, null=True, blank=True)
    id=models.CharField(max_length=200, unique=True,primary_key=True)
    company_name = models.CharField(max_length=100, unique=True)
    phone = models.CharField(max_length=10, unique=True)
    address = models.CharField(max_length=200, unique=False)
    country=models.CharField(max_length=200, unique=False)
    city=models.CharField(max_length=200, unique=False)
    class Types(models.TextChoices):
        ICE = '1','ICE'
        IF = '2','IF'
        SIRET = '3','SIRET'
    type=models.CharField(max_length=5,choices=Types.choices,default=Types.ICE)
    def __str__(self):
        return self.company_name


class Comment(models.Model):
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    writer = models.ForeignKey('Account', on_delete=models.CASCADE)
    customer = models.ForeignKey('Customer', on_delete=models.CASCADE)

    def __str__(self):
        return self.comment
