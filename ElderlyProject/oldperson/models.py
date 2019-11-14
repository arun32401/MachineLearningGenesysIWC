from django.db import models

# Create your models here.
class Oldperson(models.Model):
    SERIALNO = models.CharField(max_length = 100)
    SPORDER = models.CharField(max_length = 100)
    PUMA = models.CharField(max_length = 100)
    ST = models.CharField(max_length = 100)
    PWGTP = models.CharField(max_length = 100)
    AGEP = models.CharField(max_length = 100)

