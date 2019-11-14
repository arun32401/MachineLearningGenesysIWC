from rest_framework import viewsets
from disabledperson.models import Disabledperson
from disabledperson.myserializer import DisabledpersonSerializer
from disabledperson import disabledpersonML
from rest_framework.response import Response


class DisabledpersonViewSet(viewsets.ModelViewSet):
    queryset = Disabledperson.objects.all()
    serializer_class = DisabledpersonSerializer
    def create(self, request, *args, **kwargs):
        viewsets.ModelViewSet.create(self, request, *args, **kwargs)
        ob = Disabledperson.objects.last()
        vision_problem = disabledpersonML.pred(ob)
        return Response({"Status": "Vision Problem", "Vision problem": vision_problem, 'temp':args})
