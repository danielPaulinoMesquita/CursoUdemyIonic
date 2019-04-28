import { Component } from '@angular/core';
import { NavController, IonicPage } from 'ionic-angular';
import { MenuController } from 'ionic-angular/components/app/menu-controller';
import { CredencialDTO } from '../../models/credencial.dto';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  creds: CredencialDTO={
    email:"",
    senha:""
  };

  constructor(public navCtrl: NavController, public menu: MenuController) {

  }
  ionViewWillEnter() {
    this.menu.swipeEnable(false);
  }
  ionViewDidLeave() {
    this.menu.swipeEnable(true);
  }

  login(){
    console.log(this.creds);
    this.navCtrl.setRoot('CategoriasPage');
  }

}
