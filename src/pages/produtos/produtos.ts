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

  items : ProdutoDTO[]=[];

  page: number=0;



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
    this.produtoService.findByCategoria(categoria,this.page, 10)
    .subscribe(response=>{
      let start=this.items.length;
      this.items=this.items.concat(response['content']);
      let end=this.items.length;
      loader.dismiss();
      this.loadImageUrls(start,end);
    },error=>{
      loader.dismiss();
    });
  }

  loadImageUrls(start: number, end: number){
    for(let i=start; i<end; i++){
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
    this.page=0;
    this.items=[];
   // this.ionViewDidLoad(); chamando a requisição para carregar novamente o doRefresh
   this.loadData();
    setTimeout(() => {
        refresher.complete();
    }, 1000);
  }

  doInfinite(infiniteScroll) {
    this.page++;
    this.loadData();
    setTimeout(() => {
      infiniteScroll.complete();
    }, 1000);
  }
}