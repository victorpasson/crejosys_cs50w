from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.db import IntegrityError

import json
import csv
from .models import User

# Create your views here.
@login_required(login_url='login')
def index(request):
    if request.method == 'POST':
        data = request.FILES.get('file', None)
        if data == None:
            return JsonResponse({'message': 'Arquivo não encontrado.'}, status=404)
        
        decoder_file = data.read().decode('utf-8').splitlines()
        reader = csv.DictReader(decoder_file, delimiter=';')
        n = dict()
        for row in reader:
            n[row['REFERENCIA'].replace('.', '')] = {
                'REFERENCIA': row['REFERENCIA'].replace('.', ''),
                'DESCRICAO': row['DESCRICAO'],
                'PRECO': float(row['PRECO'].replace(',', '.')),
                'QUANTIDADE': 0,
                'IN': False
            }
            
        return JsonResponse({"table": n}, safe=False)

    #return render(request, 'mostruario/index.html')
    return render(request, 'mostruario/index.html')

def login_view(request):
    if request.user.is_authenticated:
        return redirect('index')
    
    if request.method == 'POST':
        # Autenticando usuário
        email = request.POST['email']
        password = request.POST['password']
        user = authenticate(request, username=email, password=password)

        # Vendo se foi altenticado com sucesso
        if user is not None:
            login(request, user)
            return redirect('index')
        else:
            return render(request, 'mostruario/login.html', {
                'message': 'Usuário/senha inválido(a).'
            })

    return render(request, "mostruario/login.html")

def logout_view(request):
    if request.user.is_authenticated:
        logout(request)
        return redirect('index')
    else:
        return redirect('index')


def register(request):
    if request.user.is_authenticated:
        return redirect('index')
    
    if request.method == 'POST':
        # Pegando os dados
        first_name = request.POST['first-name']
        last_name = request.POST['last-name']
        email = request.POST['email']
        password = request.POST['password']

        # Certificando de que não há dados em branco
        if any(element == "" or element == " " for element in [first_name, last_name, email, password]):
            return render(request, 'mostruario/register.html', {
                'message': 'Preencha todos os campos.'
            })
        
        # Criando novo usuário
        try:
            user = User.objects.create_user(username=email, email=email, password=password, first_name=first_name, last_name=last_name)
            user.save()
        except IntegrityError as e:
            print(e)
            return render(request, 'mostruario/register.html', {
                'message': 'E-mail já cadastrado.'
            })
        login(request, user)
        return redirect('index')

    return render(request, 'mostruario/register.html')
    
@login_required(login_url='login')
def csvmodel(request):
    response = HttpResponse(content_type='text/csv',
                            headers={'Content-Disposition': 'attachment; filename="modelotabela.csv"'})
    
    writer = csv.writer(response, delimiter=';')
    writer.writerow(['REFERENCIA','DESCRICAO','PRECO'])

    return response