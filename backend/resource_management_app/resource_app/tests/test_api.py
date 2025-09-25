import pytest
from django.urls import reverse
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from resource_app.models import (
    Resource, Keyword, ResourceType, Topic, AgeGroup, TargetUserGroup
)


@pytest.mark.django_db
def test_create_resource_api():
    client = APIClient()
    url = reverse("resource-list")

    # Create related objects
    user = User.objects.create_user(username="tester", password="pass123")
    keyword = Keyword.objects.create(name="AI")
    rtype = ResourceType.objects.create(name="Dataset")
    group = TargetUserGroup.objects.create(name="Students")
    age = AgeGroup.objects.create(name="18-25")
    topic = Topic.objects.create(name="Security")

    payload = {
        "title": "Unified Test Resource",
        "description": "Created via unified API test",
        "upload_url": "https://example.com/resource.pdf",
        "user": user.id,
        "language": "en",
        "keyword_ids": [keyword.id],
        "resource_type_ids": [rtype.id],
        "target_user_group_ids": [group.id],
        "age_group_ids": [age.id],
        "topic_ids": [topic.id],
    }

    response = client.post(url, payload, format="json")
    assert response.status_code == 201
    data = response.data
    assert data["title"] == "Unified Test Resource"
    assert Resource.objects.filter(title="Unified Test Resource").exists()
    resource = Resource.objects.get(title="Unified Test Resource")
    assert resource.keywords.first().name == "AI"
    assert resource.resource_type.first().name == "Dataset"


@pytest.mark.django_db
def test_list_resources_api():
    user = User.objects.create_user(username="tester", password="pass123")
    Resource.objects.create(
        title="List Test Resource",
        description="Seed data",
        upload_url="https://example.com/list",
        user=user
    )

    client = APIClient()
    url = reverse("resource-list")
    response = client.get(url)

    assert response.status_code == 200
    data = response.data
    assert any(r["title"] == "List Test Resource" for r in data['results'])


@pytest.mark.django_db
def test_update_resource_api():
    user = User.objects.create_user(username="tester", password="pass123")
    resource = Resource.objects.create(
        title="Old Title",
        description="Old description",
        upload_url="https://example.com/old",
        user=user
    )

    # Create related objects
    keyword = Keyword.objects.create(name="Updated Keyword")
    rtype = ResourceType.objects.create(name="Updated Type")
    group = TargetUserGroup.objects.create(name="Updated Group")
    age = AgeGroup.objects.create(name="25-35")
    topic = Topic.objects.create(name="Updated Topic")

    payload = {
        "title": "Updated Title",
        "description": "Updated Description",
        "upload_url": "https://example.com/updated",
        "language": "en",
        "keyword_ids": [keyword.id],
        "resource_type_ids": [rtype.id],
        "target_user_group_ids": [group.id],
        "age_group_ids": [age.id],
        "topic_ids": [topic.id],
    }

    client = APIClient()
    url = reverse("resource-detail", args=[resource.id])
    response = client.put(url, payload, format="json")

    assert response.status_code == 200
    resource.refresh_from_db()
    assert resource.title == "Updated Title"
    assert resource.keywords.first().name == "Updated Keyword"
    assert resource.resource_type.first().name == "Updated Type"


@pytest.mark.django_db
def test_delete_resource_api():
    user = User.objects.create_user(username="tester", password="pass123")
    resource = Resource.objects.create(
        title="To Delete",
        description="Delete test",
        upload_url="https://example.com/delete",
        user=user
    )

    client = APIClient()
    url = reverse("resource-detail", args=[resource.id])
    response = client.delete(url)

    assert response.status_code == 204
    assert not Resource.objects.filter(id=resource.id).exists()

@pytest.mark.django_db
def test_list_resources_with_filter():

    user = User.objects.create_user(username="tester", password="pass123")
    kw_ai = Keyword.objects.create(name="AI")
    kw_ml = Keyword.objects.create(name="ML")

    r1 = Resource.objects.create(title="AI Dataset", language="en", upload_url="https://a.com", user=user)
    r1.keywords.add(kw_ai)
    r2 = Resource.objects.create(title="ML Dataset", language="en", upload_url="https://b.com", user=user)
    r2.keywords.add(kw_ml)

    client = APIClient()
    url = reverse("resource-list") + f"?keywords={kw_ai.id}"
    response = client.get(url)

    assert response.status_code == 200
    data = response.data['results']
    assert any(r['title'] == "AI Dataset" for r in data)
    assert all(kw['name'] == "AI" for r in data for kw in r['keywords'])

@pytest.mark.django_db
def test_resource_pagination():
    user = User.objects.create_user(username="tester", password="pass123")
    for i in range(15):
        Resource.objects.create(title=f"Dataset {i}", language="en", upload_url=f"https://{i}.com", user=user)

    client = APIClient()
    url = reverse("resource-list") + "?page_size=10"
    response = client.get(url)

    assert response.status_code == 200
    assert len(response.data['results']) == 10
    assert response.data['count'] == 15


@pytest.mark.django_db
def test_partial_update_resource():

    user = User.objects.create_user(username="tester", password="pass123")
    resource = Resource.objects.create(title="Old Title", language="en", upload_url="https://old.com", user=user)

    client = APIClient()
    url = reverse("resource-detail", args=[resource.id])
    response = client.patch(url, {"title": "New Title"}, format="json")

    assert response.status_code == 200
    resource.refresh_from_db()
    assert resource.title == "New Title"
    assert resource.upload_url == "https://old.com"

