const flameMixer = extendContent(GenericCrafter, "napalmmixer", {
  load(){
    this.super$load();
    for(i = 0; i < 4; i ++){
      this.liquidRegions[i] = Core.atlas.find(this.name + "-liquid-" + i);
    }
    this.topRegion = Core.atlas.find(this.name + "-top");
  },
  init(){
    this.outputLiquid = new LiquidStack(Vars.content.getByName(ContentType.liquid, "ohno-missiles-napalm"), 12);
    this.super$init();
  },
  setStats(){
    this.super$setStats();
    
    this.stats.add(BlockStat.input, "Mixing:", "Mixing:");
    
    this.stats.add(BlockStat.input,this.inputLiquids[0].liquid,this.inputLiquids[0].amount, false);
    this.stats.add(BlockStat.input,this.inputLiquids[1].liquid,this.inputLiquids[1].amount, false);
    
    this.stats.add(BlockStat.input, "| Coolant:", "| Coolant:");
    
    this.stats.add(BlockStat.input,this.coolantLiquids[0].liquid,this.coolantLiquids[0].amount*60, true);
    this.stats.add(BlockStat.input, "or", "or");
    this.stats.add(BlockStat.input,this.coolantLiquids[0].liquid,this.coolantLiquids[1].amount*60, true);
  },
  acceptLiquid(tile,source,liquid,amount){
    const entity=tile.ent();
    if(entity.liquids.get(liquid) + amount > this.liquidCapacity){
      return false;
    }
    for(i = 0; i < 2; i ++){
      for(e = 0; e < 2; e++){
        if(liquid == this.inputLiquids[i].liquid && tile.entity.liquids.get(this.coolantLiquids[e].liquid) >= this.coolantLiquids[e].amount*60){
          return true;
        }
      }
    }
    for(f = 0; f < 2; f++){
      if(liquid == this.coolantLiquids[f].liquid && tile.entity.liquids.get(this.coolantLiquids[1-f].liquid) <= 1){
        return true;
      }
    }
  },
  shouldConsume(tile){
    entity = tile.ent();
    if(tile.entity.liquids.get(this.outputLiquid.liquid) < this.liquidCapacity && tile.entity.liquids.get(this.inputLiquids[0].liquid) >= this.inputLiquids[0].amount && tile.entity.liquids.get(this.inputLiquids[1].liquid) >= this.inputLiquids[1].amount && tile.entity.liquids.get(this.coolantLiquids[0].liquid) >= this.coolantLiquids[0].amount){
      return true;
    }
    if(tile.entity.liquids.get(this.outputLiquid.liquid) < this.liquidCapacity && tile.entity.liquids.get(this.inputLiquids[0].liquid) >= this.inputLiquids[0].amount && tile.entity.liquids.get(this.inputLiquids[1].liquid) >= this.inputLiquids[1].amount && tile.entity.liquids.get(this.coolantLiquids[1].liquid) >= this.coolantLiquids[1].amount){
      return true;
    }
    else{
      return false;
    }
  },
  draw(tile){
    entity = tile.ent();
    
    Draw.rect(this.region, tile.drawx(), tile.drawy());
    
    //Left tank, slag
    Draw.color(this.inputLiquids[0].liquid.color);
    Draw.alpha(tile.entity.liquids.get(this.inputLiquids[0].liquid) / this.liquidCapacity);
    Draw.rect(this.liquidRegions[0], tile.drawx(), tile.drawy());
    Draw.color();
    
    //Right tank, oil
    Draw.color(this.inputLiquids[1].liquid.color);
    Draw.alpha(tile.entity.liquids.get(this.inputLiquids[1].liquid) / this.liquidCapacity);
    Draw.rect(this.liquidRegions[1], tile.drawx(), tile.drawy());
    Draw.color();
    
    //Middle tank, Napalm
    Draw.color(this.outputLiquid.liquid.color);
    Draw.alpha(tile.entity.liquids.get(this.outputLiquid.liquid) / this.liquidCapacity);
    Draw.rect(this.liquidRegions[2], tile.drawx(), tile.drawy());
    Draw.color();
    
    //Other tank, Coolant
    if(tile.entity.liquids.get(this.coolantLiquids[0].liquid) > tile.entity.liquids.get(this.coolantLiquids[1].liquid) || tile.entity.liquids.get(this.coolantLiquids[0].liquid) == tile.entity.liquids.get(this.coolantLiquids[1].liquid)){
      Draw.color(this.coolantLiquids[0].liquid.color);
      Draw.alpha(tile.entity.liquids.get(this.coolantLiquids[0].liquid) / this.liquidCapacity);
      Draw.rect(this.liquidRegions[3], tile.drawx(), tile.drawy());
      Draw.color();
    }
    if(tile.entity.liquids.get(this.coolantLiquids[1].liquid) > tile.entity.liquids.get(this.coolantLiquids[0].liquid)){
      Draw.color(this.coolantLiquids[1].liquid.color);
      Draw.alpha(tile.entity.liquids.get(this.coolantLiquids[1].liquid) / this.liquidCapacity);
      Draw.rect(this.liquidRegions[3], tile.drawx(), tile.drawy());
      Draw.color();
    }
    
    Draw.rect(this.topRegion, tile.drawx(), tile.drawy());
	},
  update(tile){
    entity = tile.ent();
    
    if(entity.cons.valid()){
      entity.progress += this.getProgressIncrease(entity, this.craftTime);
      entity.totalProgress += entity.delta();
      entity.warmup = Mathf.lerpDelta(entity.warmup, 1, 0.02);
    }
    else{
      entity.warmup = Mathf.lerp(entity.warmup, 0, 0.02);
    }
    
    //consume coolant if there's oil and slag in the mixer
    if(tile.entity.liquids.get(this.inputLiquids[0].liquid) > 0 && tile.entity.liquids.get(this.inputLiquids[1].liquid) > 0){
      entity.liquids.remove(this.coolantLiquids[0].liquid, this.coolantLiquids[0].amount);
      entity.liquids.remove(this.coolantLiquids[1].liquid, this.coolantLiquids[1].amount);
    }
    
    if(entity.progress >= 1){
      entity.cons.trigger();
      
      entity.liquids.remove(this.inputLiquids[0].liquid, this.inputLiquids[0].amount);
      entity.liquids.remove(this.inputLiquids[1].liquid, this.inputLiquids[1].amount);
      
      this.handleLiquid(tile, tile, this.outputLiquid.liquid, this.outputLiquid.amount);
      
      Effects.effect(this.craftEffect, tile.drawx(), tile.drawy());
      entity.progress = 0;
    }
    
    this.tryDumpLiquid(tile, this.outputLiquid.liquid);
  },
  setBars(){
    this.super$setBars();
    
    this.bars.remove("liquid");
    
    this.bars.add("Slag",func(entity =>
      new Bar(prov(() => this.inputLiquids[0].liquid.localizedName), prov(() => this.inputLiquids[0].liquid.barColor()), floatp(() => entity.liquids.get(this.inputLiquids[0].liquid) / this.liquidCapacity))
    ));
    this.bars.add("Oil",func(entity =>
      new Bar(prov(() => this.inputLiquids[1].liquid.localizedName), prov(() => this.inputLiquids[1].liquid.barColor()), floatp(() => entity.liquids.get(this.inputLiquids[1].liquid) / this.liquidCapacity))
    ));
    this.bars.add("Water",func(entity =>
      new Bar(prov(() => this.coolantLiquids[0].liquid.localizedName), prov(() => this.coolantLiquids[0].liquid.barColor()), floatp(() => entity.liquids.get(this.coolantLiquids[0].liquid) / this.liquidCapacity))
    ));
    this.bars.add("Cryofluid",func(entity =>
      new Bar(prov(() => this.coolantLiquids[1].liquid.localizedName), prov(() => this.coolantLiquids[1].liquid.barColor()), floatp(() => entity.liquids.get(this.coolantLiquids[1].liquid) / this.liquidCapacity))
    ));
    this.bars.add("[#EA8878]Naplam",func(entity =>
      new Bar(prov(() => this.outputLiquid.liquid.localizedName), prov(() => this.outputLiquid.liquid.barColor()), floatp(() => entity.liquids.get(this.outputLiquid.liquid) / this.liquidCapacity))
    ));
  },
	generateIcons(){
		return [
			Core.atlas.find(this.name),
			Core.atlas.find(this.name + "-top"),
		];
	}
});

flameMixer.liquidCapacity = 36;
flameMixer.hasLiquids = true;
flameMixer.craftTime = 45;
flameMixer.liquidRegions = [];
flameMixer.inputLiquids = [new LiquidStack(Liquids.slag, 22.5), new LiquidStack(Liquids.oil, 12)];
flameMixer.coolantLiquids = [new LiquidStack(Liquids.water, 0.5), new LiquidStack(Liquids.cryofluid, 0.5)];
flameMixer.craftEffect = Fx.pulverizeRedder;
flameMixer.updateEffect = Fx.lava;