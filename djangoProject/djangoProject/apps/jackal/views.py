from django.shortcuts import render

def index(request):
    return render(request, 'home.html')

def rules(request):
    return render(request, 'rules.html')

def game(request):
    return render(request, 'game.html', context={'cycle': [0, 1,2,3,4,5,6,7,8,9,10,11,12]})