//Code copyied from younggam/multi-lib by younggam

//get moudle from library
const lib=require("multi-lib/library");

module.exports={
  extend(Type,Entity,name,def,recipes){
    const block=Object.create(lib.body);
    const rec=JSON.parse(JSON.stringify(recipes));
    Object.assign(block,def,rec);
    const multi=extendContent(Type,name,block);
    //extend entity
    multi.entityType=prov(()=>extend(GenericCrafter.GenericCrafterEntity,{
      //버튼 눌린거 저장
      modifyToggle(a){
        this._toggle=a;
      },
      getToggle(){
        return this._toggle;
      },
      _toggle:0,
      //버튼 바꼈을때 진행상황 저장
      saveProgress(c,d){
        this._progressArr[c]=d;
      },
      getProgress(e){
        return this._progressArr[e];
      },
      _progressArr:[],
      //현재 생산 중인지 저장
      saveCond(f){
        this._cond=f;
      },
      getCond(){
        return this._cond;
      },
      _cond:false,
      //전력 출력 바 용 현재 전력출력상황
      setPowerStat(g){
        this._powerStat=g;
      },
      getPowerStat(){
        return this._powerStat;
      },
      _powerStat:0,
      //현재 각 아이템 수량
      getItemStat(){
        return this._itemStat;
      },
      _itemStat:[],
      //
    }));
    //power request change every recipe
    multi.consumes.add(extend(ConsumePower,{
      requestedPower(entity){
        if(entity.tile.entity==null){
          return 0;
        }
        for(var i=0;i<multi.input.length;i++){
          if(entity.tile.entity.getToggle()==i&&multi.input[i][2]!=null&&entity.tile.entity.getCond()){
            return multi.input[i][2];
          }
        }
        return 0;
      }
    }));
    //don't modify these
    multi.configurable=true;
    multi.hasItems=true;
    multi.hasLiquids=true;
    multi.hasPower=true;
    return multi;
  }
}