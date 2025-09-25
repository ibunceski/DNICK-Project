import pytest
from django.core.files.uploadedfile import SimpleUploadedFile

from resource_app.serializers import ResourceSerializer
from resource_app.models import Resource, Keyword, ResourceType, TargetUserGroup, AgeGroup, Topic


@pytest.mark.django_db
def test_resource_serializer_input():
    keyword = Keyword.objects.create(name="security")
    rtype = ResourceType.objects.create(name="dataset")
    group = TargetUserGroup.objects.create(name="students")
    age = AgeGroup.objects.create(name="18-25")
    topic = Topic.objects.create(name="AI")

    data = {
        "title": "Cyber dataset",
        "description": "A dataset for AI security models",
        "upload_url": "https://example.com/resource.pdf",
        "language": "en",
        "keyword_ids": [keyword.id],
        "resource_type_ids": [rtype.id],
        "target_user_group_ids": [group.id],
        "age_group_ids": [age.id],
        "topic_ids": [topic.id],
    }

    serializer = ResourceSerializer(data=data, context={"request": None})
    assert serializer.is_valid(), serializer.errors
    resource = serializer.save()

    assert resource.title == "Cyber dataset"
    assert resource.upload_url == "https://example.com/resource.pdf"
    assert resource.keywords.first().name == "security"
    assert resource.resource_type.first().name == "dataset"
    assert resource.target_user_groups.first().name == "students"
    assert resource.age_groups.first().name == "18-25"
    assert resource.topic.first().name == "AI"


@pytest.mark.django_db
def test_serializer_rejects_both_file_and_url(tmp_path):
    test_file = SimpleUploadedFile("file.txt", b"dummy content", content_type="text/plain")

    keyword = Keyword.objects.create(name="security")
    rtype = ResourceType.objects.create(name="dataset")
    group = TargetUserGroup.objects.create(name="students")
    age = AgeGroup.objects.create(name="18-25")
    topic = Topic.objects.create(name="AI")

    payload = {
        "title": "Bad Resource",
        "description": "Description",
        "language": "en",
        "upload_file": test_file,
        "upload_url": "https://example.com",
        "keyword_ids": [keyword.id],
        "resource_type_ids": [rtype.id],
        "target_user_group_ids": [group.id],
        "age_group_ids": [age.id],
        "topic_ids": [topic.id],
    }

    serializer = ResourceSerializer(data=payload, context={"request": type('Request', (), {'method': 'POST'})()})
    assert not serializer.is_valid()
    assert "You cannot provide both upload_url and upload_file" in str(serializer.errors)


@pytest.mark.django_db
def test_serializer_rejects_not_file_or_url(tmp_path):
    keyword = Keyword.objects.create(name="security")
    rtype = ResourceType.objects.create(name="dataset")
    group = TargetUserGroup.objects.create(name="students")
    age = AgeGroup.objects.create(name="18-25")
    topic = Topic.objects.create(name="AI")

    payload = {
        "title": "Bad Resource",
        "description": "Description",
        "language": "en",
        "keyword_ids": [keyword.id],
        "resource_type_ids": [rtype.id],
        "target_user_group_ids": [group.id],
        "age_group_ids": [age.id],
        "topic_ids": [topic.id],
    }

    serializer = ResourceSerializer(data=payload, context={"request": type('Request', (), {'method': 'POST'})()})
    assert not serializer.is_valid()
    assert "Either upload_url or upload_file must be provided." in str(serializer.errors)


@pytest.mark.django_db
def test_resource_serializer_output_includes_relations():
    keyword = Keyword.objects.create(name="security")
    resource = Resource.objects.create(
        title="Dataset Serializer",
        description="Testing serializer",
        upload_url="https://example.com",
        language="en"
    )
    resource.keywords.add(keyword)

    serializer = ResourceSerializer(resource)
    data = serializer.data

    assert data["title"] == "Dataset Serializer"
    assert data["description"] == "Testing serializer"
    assert data["upload_url"] == "https://example.com"
    assert data["keywords"][0]["name"] == "security"
