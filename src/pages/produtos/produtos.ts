import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController} from 'ionic-angular';
import { ProdutoDTO } from '../../models/produto.dto';
import { ProdutoService } from '../../services/domain/produto.service';
import { API_CONFIG } from '../../config/api.config';

@IonicPage()
@Component({
  selector: 'page-produtos',
  templateUrl: 'produtos.html',
})
export class ProdutosPage {

  items : ProdutoDTO[];

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public produtoService: ProdutoService,
    public loadingController: LoadingController) {
  }

  ionViewDidLoad() {
    this.loadData();
  };

  loadData(){
    let categoria= this.navParams.get('categoria_id');
    //Colocar loading aqui, ates de carregar as categorias
    let loader= this.presentLoading();
    this.produtoService.findByCategoria(categoria)
    .subscribe(response=>{
      this.items=response['content'];
      loader.dismiss();
      this.loadImageUrls();
    },error=>{
      loader.dismiss();
    });
  }

  loadImageUrls(){
    for(let i=0; i<this.items.length; i++){
        let item=this.items[i];
        this.produtoService.getSmallImageFromBucket(item.id)
        .subscribe(response=>{
                item.imageUrl=`${API_CONFIG.bucketBaseUrl}/prod${item.id}-small.jpg`;
         },error=>{});
     }
  }
  //ProdutoDetailPage

  showDetail(produto_id:string){
    this.navCtrl.push('ProdutoDetailPage',{produto_id:produto_id});
  }

  // LOADING DA TELA  
  presentLoading() {
    const loader = this.loadingController.create({
      content: "Aguarde..."
    });
    loader.present();
    return loader;
  }
  
  doRefresh(refresher) {
   // this.ionViewDidLoad(); chamando a requisição para carregar novamente o doRefresh
   this.loadData();
    setTimeout(() => {
        refresher.complete();
    }, 1000);
  }
}