import { Component } from '@angular/core';
import { FoodService } from './service/food.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  registerObj : any = {
      "userId": 0,
      "userName": "",
      "role": "Customer",
      "password": "",
      "mobileNo": "",
      "emailId": "",
      "restaurantId": 0
    };

    loggedUserData:any;
    loginObj:any={
      "userName": "",
      "password": ""
    }
    constructor(private foodService: FoodService){
      const isLocalData = localStorage.getItem('zomato_user');
      if(isLocalData != null){
        this.loggedUserData = JSON.parse(isLocalData);
      }
    }

  onLogoff(){
    localStorage.removeItem('zomato_user');
    this.loggedUserData = null;
  }
  onLogin(){
    const model = document.getElementById('loginModal');
    if(model !=null){
      model.style.display = 'block'
    }
  }
  onRegister(){
    const model = document.getElementById('registerModal');
    if(model != null){
      model.style.display = 'block'
    }
  }
  closeLogin(){
    const model = document.getElementById('loginModal');
    if(model != null){
      model.style.display = 'none'
    }
  }
  closeRegister(){
    const model = document.getElementById('registerModal');
    if(model != null){
      model.style.display = 'none'
    }
  }
  login(){
    this.foodService.onLogin(this.loginObj).subscribe((res:any)=>{
      if(res.result){
        this.closeLogin();
        alert('Login success');
        localStorage.setItem('zomato_user',JSON.stringify(res.data));
        this.loggedUserData = res.data;
      }else{
        alert(res.message);
      }
    })
  }
  onSave(){
    this.foodService.onRegister(this.registerObj).subscribe((res:any)=>{
      if(res.result){
        this.closeRegister();
        alert('Registration success');
        localStorage.setItem('zomato_user',JSON.stringify(res.data));
        this.loggedUserData = res.data;
      }else{
        alert(res.message);
      }
    })
  }
}

