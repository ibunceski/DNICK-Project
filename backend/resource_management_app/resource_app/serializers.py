from rest_framework import serializers
from .models import *

class KeywordSerializer(serializers.ModelSerializer):
    class Meta:
        model = Keyword
        fields = ["id", "name"]  # keep ID + name

class ResourceTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ResourceType
        fields = ["id", "name"]

class TargetUserGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = TargetUserGroup
        fields = ["id", "name"]

class AgeGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = AgeGroup
        fields = ["id", "name"]

class TopicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Topic
        fields = ["id", "name"]


class ResourceSerializer(serializers.ModelSerializer):
    # Nested serializers for reads
    keywords = KeywordSerializer(many=True, read_only=True)
    resource_type = ResourceTypeSerializer(many=True, read_only=True)
    target_user_groups = TargetUserGroupSerializer(many=True, read_only=True)
    age_groups = AgeGroupSerializer(many=True, read_only=True)
    topic = TopicSerializer(many=True, read_only=True)

    # Writable fields (so you can still POST/PUT IDs)
    keyword_ids = serializers.PrimaryKeyRelatedField(
        many=True, queryset=Keyword.objects.all(), source="keywords", write_only=True
    )
    resource_type_ids = serializers.PrimaryKeyRelatedField(
        many=True, queryset=ResourceType.objects.all(), source="resource_type", write_only=True
    )
    target_user_group_ids = serializers.PrimaryKeyRelatedField(
        many=True, queryset=TargetUserGroup.objects.all(), source="target_user_groups", write_only=True
    )
    age_group_ids = serializers.PrimaryKeyRelatedField(
        many=True, queryset=AgeGroup.objects.all(), source="age_groups", write_only=True
    )
    topic_ids = serializers.PrimaryKeyRelatedField(
        many=True, queryset=Topic.objects.all(), source="topic", write_only=True
    )

    class Meta:
        model = Resource
        fields = "__all__"

    def update(self, instance, validated_data):
        if 'upload_file' not in validated_data:
            validated_data['upload_file'] = instance.upload_file
        return super().update(instance, validated_data)

    def validate(self, data):
        upload_url = data.get('upload_url')
        upload_file = data.get('upload_file')

        if not upload_url and not upload_file:
            raise serializers.ValidationError("Either upload_url or upload_file must be provided.")

        if upload_url and upload_file:
            raise serializers.ValidationError("You cannot provide both upload_url and upload_file at the same time.")

        return data
