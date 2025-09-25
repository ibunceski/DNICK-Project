import time

import pytest
from django.urls import reverse
from rest_framework.test import APIRequestFactory
from resource_app.views import ResourceViewSet
from resource_app.models import Resource, Keyword


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
def test_list_resources_view_count():
    Resource.objects.create(title="ViewTest Dataset1", description="Testing viewset")
    Resource.objects.create(title="ViewTest Dataset2", description="Testing viewset")

    factory = APIRequestFactory()
    view = ResourceViewSet.as_view({"get": "list"})
    request = factory.get(reverse("resource-list"))
    response = view(request)

    assert response.status_code == 200
    assert len(response.data['results']) == 2

@pytest.mark.django_db
def test_list_resources_view_with_filter():
    kw = Keyword.objects.create(name="AI")
    r1 = Resource.objects.create(title="AI Dataset", language="en", upload_url="https://a.com")
    r1.keywords.add(kw)
    r2 = Resource.objects.create(title="Other Dataset", language="en", upload_url="https://b.com")

    factory = APIRequestFactory()
    view = ResourceViewSet.as_view({"get": "list"})
    request = factory.get(reverse("resource-list"), {"keywords": kw.id})
    response = view(request)

    assert response.status_code == 200
    data = response.data['results']
    assert len(data) == 1
    assert data[0]['title'] == "AI Dataset"


@pytest.mark.django_db
def test_list_resources_view_pagination():
    for i in range(15):
        Resource.objects.create(title=f"Dataset {i}", language="en", upload_url=f"https://{i}.com")

    factory = APIRequestFactory()
    view = ResourceViewSet.as_view({"get": "list"})
    request = factory.get(reverse("resource-list"), {"page_size": 10})
    response = view(request)

    assert response.status_code == 200
    assert len(response.data['results']) == 10
    assert response.data['count'] == 15


@pytest.mark.django_db
def test_list_resources_view_ordering():
    r1 = Resource.objects.create(title="First", language="en", upload_url="https://1.com")
    time.sleep(0.01)
    r2 = Resource.objects.create(title="Second", language="en", upload_url="https://2.com")

    factory = APIRequestFactory()
    view = ResourceViewSet.as_view({"get": "list"})
    request = factory.get(reverse("resource-list"))
    response = view(request)

    assert response.data['results'][0]['title'] == "Second"
    assert response.data['results'][1]['title'] == "First"

