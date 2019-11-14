from django.db import models

# Create your models here.
class Disabledperson(models.Model):
    PUMA = models.IntegerField()
    ST = models.IntegerField()
    AGEP = models.IntegerField()
    SEX = models.IntegerField(choices = (("1", "MALE"),("2", "FEMALE")))
    
    def to_dict(self):
        return{
            'PUMA':self.PUMA,
            'ST':self.ST,
            'AGEP':self.AGEP,
            'SEX':self.SEX
            }
