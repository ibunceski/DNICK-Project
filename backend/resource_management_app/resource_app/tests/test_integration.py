import pytest
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from resource_app.models import Resource, Keyword, ResourceType


@pytest.mark.django_db
def test_create_resource_via_api():
    client = APIClient()
    user = User.objects.create_user(username="tester", password="pass123")

    # prepare related objects
    keyword = Keyword.objects.create(name="AI")
    resource_type = ResourceType.objects.create(name="Dataset")

    payload = {
        "title": "Integration Test Resource",
        "description": "Created via API",
        "upload_url": "https://example.com/resource",
        "user": user.id,
        "language": "en",
        "keyword_ids": [keyword.id],
        "resource_type_ids": [resource_type.id],
        "target_user_group_ids": [],
        "age_group_ids": [],
        "topic_ids": []
    }

    response = client.post("/api/resources/", payload, format="json")

    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "Integration Test Resource"
    assert Resource.objects.count() == 1
    resource = Resource.objects.first()
    assert resource.keywords.first().name == "AI"
    assert resource.resource_type.first().name == "Dataset"


@pytest.mark.django_db
def test_list_resources_api():
    client = APIClient()
    user = User.objects.create_user(username="tester", password="pass123")
    Resource.objects.create(
        title="Existing Resource",
        description="Seed data",
        upload_url="https://example.com/existing",
        user=user
    )

    response = client.get("/api/resources/")
    assert response.status_code == 200
    data = response.json()
    print(data)
    assert any(r["title"] == "Existing Resource" for r in data['results'])


@pytest.mark.django_db
def test_update_resource_api():
    client = APIClient()
    user = User.objects.create_user(username="tester", password="pass123")
    resource = Resource.objects.create(
        title="Old Title",
        description="Old description",
        upload_url="https://example.com/old",
        user=user
    )

    payload = {"title": "Updated Title"}
    response = client.patch(f"/api/resources/{resource.id}/", payload, format="json")
    assert response.status_code == 200
    resource.refresh_from_db()
    assert resource.title == "Updated Title"


@pytest.mark.django_db
def test_delete_resource_api():
    client = APIClient()
    user = User.objects.create_user(username="tester", password="pass123")
    resource = Resource.objects.create(
        title="To Delete",
        description="Will be deleted",
        upload_url="https://example.com/delete",
        user=user
    )

    response = client.delete(f"/api/resources/{resource.id}/")
    assert response.status_code == 204
    assert Resource.objects.count() == 0
