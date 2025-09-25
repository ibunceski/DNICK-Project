import pytest
from django.urls import reverse
from rest_framework.test import APIRequestFactory
from resource_app.views import ResourceViewSet
from resource_app.models import Resource

@pytest.mark.django_db
def test_list_resources_view():
    Resource.objects.create(title="ViewTest Dataset", description="Testing viewset")

    factory = APIRequestFactory()
    view = ResourceViewSet.as_view({"get": "list"})
    request = factory.get(reverse("resource-list"))
    response = view(request)

    assert response.status_code == 200
    assert response.data['results'][0]['title'] == "ViewTest Dataset"

@pytest.mark.django_db
def test_list_resources_view():
    Resource.objects.create(title="ViewTest Dataset1", description="Testing viewset")
    Resource.objects.create(title="ViewTest Dataset2", description="Testing viewset")

    factory = APIRequestFactory()
    view = ResourceViewSet.as_view({"get": "list"})
    request = factory.get(reverse("resource-list"))
    response = view(request)

    assert response.status_code == 200
    assert len(response.data['results']) == 2
