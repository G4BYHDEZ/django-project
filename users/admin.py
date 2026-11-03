from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import User


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    ordering = ('email',)
    list_display = ('email', 'username', 'first_name', 'last_name', 'is_staff')
    add_fieldsets = UserAdmin.add_fieldsets + ((None, {'fields': ('email',)}),)
