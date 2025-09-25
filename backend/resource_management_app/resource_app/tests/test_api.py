import pytest
from django.urls import reverse
from rest_framework.test import APIClient
from resource_app.models import Resource, Keyword, ResourceType, Topic, AgeGroup, TargetUserGroup


@pytest.mark.django_db
def test_create_resource_api():
    client = APIClient()
    url = reverse("resource-list")

    keyword = Keyword.objects.create(name="security")
    rtype = ResourceType.objects.create(name="dataset")
    group = TargetUserGroup.objects.create(name="students")
    age = AgeGroup.objects.create(name="18-25")
    topic = Topic.objects.create(name="AI")

    data = {
        "title": "API Dataset",
        "description": "A dataset for AI security models",
        "upload_url": "https://example.com/resource.pdf",
        "language": "en",
        "keyword_ids": [keyword.id],
        "resource_type_ids": [rtype.id],
        "target_user_group_ids": [group.id],
        "age_group_ids": [age.id],
        "topic_ids": [topic.id],
    }

    response = client.post(url, data, format="json")
    print(response.content)
    assert response.status_code == 201
    assert response.data["title"] == "API Dataset"
    assert Resource.objects.filter(title="API Dataset").exists()


@pytest.mark.django_db
def test_list_resources_api():
    Resource.objects.create(title="API List Dataset", description="List test")

    client = APIClient()
    url = reverse("resource-list")
    response = client.get(url)

    assert response.status_code == 200
    assert any(r["title"] == "API List Dataset" for r in response.data['results'])


@pytest.mark.django_db
def test_update_resource_api():
    resource = Resource.objects.create(title="Old Title", description="To be updated")

    keyword = Keyword.objects.create(name="security")
    rtype = ResourceType.objects.create(name="dataset")
    group = TargetUserGroup.objects.create(name="students")
    age = AgeGroup.objects.create(name="18-25")
    topic = Topic.objects.create(name="AI")

    data = {
        "title": "Updated Title",
        "description": "Updated Description",
        "upload_url": "https://example.com/resource.pdf",
        "language": "en",
        "keyword_ids": [keyword.id],
        "resource_type_ids": [rtype.id],
        "target_user_group_ids": [group.id],
        "age_group_ids": [age.id],
        "topic_ids": [topic.id],
    }

    client = APIClient()
    url = reverse("resource-detail", args=[resource.id])

    response = client.put(url, data, format="json")
    print(response.content)
    assert response.status_code == 200
    resource.refresh_from_db()
    assert resource.title == "Updated Title"


@pytest.mark.django_db
def test_delete_resource_api():
    resource = Resource.objects.create(title="To Delete", description="Delete test")

    client = APIClient()
    url = reverse("resource-detail", args=[resource.id])
    response = client.delete(url)

    assert response.status_code == 204
    assert not Resource.objects.filter(id=resource.id).exists()
