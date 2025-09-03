from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from django.db import models

class Keyword(models.Model):
    name = models.TextField(unique=True)

    def __str__(self):
        return self.name


class ResourceType(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name


class TargetUserGroup(models.Model):
    name = models.TextField(unique=True)

    def __str__(self):
        return self.name


class AgeGroup(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name


class Topic(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name


class Resource(models.Model):
    LANGUAGE_CHOICES = [("en", "English"), ("mk", "Macedonian"), ("al", "Albanian")]

    title = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    upload_file = models.FileField(upload_to="resources/", blank=True, null=True)
    upload_url = models.TextField(blank=True, null=True)
    language = models.CharField(max_length=20, choices=LANGUAGE_CHOICES)
    resource_type = models.ManyToManyField(ResourceType, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)
    target_user_groups = models.ManyToManyField(TargetUserGroup, blank=True)
    age_groups = models.ManyToManyField(AgeGroup, blank=True)
    keywords = models.ManyToManyField(Keyword, blank=True)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    author = models.TextField(null=True, blank=True)
    topic = models.ManyToManyField(Topic, blank=True)

    def __str__(self):
        return self.title

    def clean(self):
        if not self.upload_file and not self.upload_url:
            raise ValidationError("Either upload a file or provide a URL to continue.")
