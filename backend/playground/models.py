from django.db import models
from django.contrib.auth.models import User

class Execution(models.Model):
    user = models.ForeignKey(
        to=User,
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )
    code = models.TextField()
    output = models.TextField(blank=True)
    status = models.SmallIntegerField()
    execution_time = models.FloatField()
    created_at = models.DateTimeField(auto_now_add=True)