const aclib = require("ohno-missiles/advancecontentfunclib"); //kinda obvious where this came from

//Code copyied from younggam/multi-lib-example by younggam

//get script from multi-lib
const multiLib=require("multi-lib/wrapper");
//you can use GenericSmelter
const missileUpgrader=multiLib.extend(GenericCrafter,GenericCrafter.GenericCrafterEntity, "missile-upgrader",{
// you can customize here ex) draw(tile)
  load(){
    this.region = Core.atlas.find(this.name);
    this.decal = Core.atlas.find(this.name + "-decal");
    this.original = Core.atlas.find(this.name + "-original");
    for(i = 0; i < 11; i++){
      this.topRegions[i] = Core.atlas.find(this.name + "-top-" + i);
      this.itemRegions[i] = Core.atlas.find(this.name + "-item-" + i);
    }
  },
  draw(tile){
    entity = tile.ent();
    
    Draw.rect(this.region, tile.drawx(), tile.drawy());
    Draw.color(Color.valueOf("363646"));
    Draw.rect(this.topRegions[tile.entity.getToggle() + 1], tile.drawx(), tile.drawy());
    Draw.color();
    
    Draw.color(this.missileColors[tile.entity.getToggle() + 1]);
    Draw.rect(this.decal, tile.drawx(), tile.drawy());
    Draw.color();
    
    if(entity.warmup > 0 && tile.entity.getToggle() > -1 && tile.entity.getToggle() < 9){
      Draw.color(this.missileColors[tile.entity.getToggle() + 1]);
      Draw.alpha(entity.warmup);
      Draw.rect(this.topRegions[tile.entity.getToggle() + 1], tile.drawx(), tile.drawy());
      Draw.color();
      
      var craftAnimSpeed = this.produceTimes[tile.entity.getToggle() + 1] / 20;
      var craftAnimLoc = Mathf.sin(entity.totalProgress / craftAnimSpeed) * 7;
      
      Draw.color(Color.valueOf("565666"));
      Draw.alpha(entity.warmup * 0.8);
      Lines.stroke(2);
      Lines.line(tile.drawx() + craftAnimLoc, tile.drawy() + 10, tile.drawx() + craftAnimLoc, tile.drawy() + 16);
      Lines.line(tile.drawx() - craftAnimLoc, tile.drawy() - 10, tile.drawx() - craftAnimLoc, tile.drawy() - 16);
      Draw.color();
      
      Shaders.build.region = this.itemRegions[tile.entity.getToggle() + 1];
      Shaders.build.progress = entity.progress / this.produceTimes[tile.entity.getToggle() + 1];
      Shaders.build.color = Pal.accent;
      Shaders.build.color.a = entity.progress;
      Shaders.build.time = -entity.totalProgress / 20;
      
      Draw.shader(Shaders.build);
      //Draw.alpha(entity.progress);
      //top upgraded missle
      Draw.rect(this.itemRegions[tile.entity.getToggle() + 1], tile.drawx(), tile.drawy());
      Draw.shader();
      
      if(tile.entity.items.get(Vars.content.getByName(ContentType.item, "ohno-missiles-missile")) >= 1){
        Shaders.build.region = this.itemRegions[tile.entity.getToggle() + 1];
        Shaders.build.progress = (1 - entity.progress) / this.produceTimes[tile.entity.getToggle() + 1];
        Shaders.build.color = Pal.accent;
        Shaders.build.color.a = 1 - entity.progress;
        Shaders.build.time = -entity.totalProgress / 20;
        
        //bottom original missile
        Draw.shader(Shaders.build);
        //Draw.alpha(1 - entity.progress);
        Draw.rect(this.original, tile.drawx(), tile.drawy());
        Draw.shader();
      }
      
      Draw.color(Pal.accent);
      Draw.alpha(entity.warmup * 0.8);
      Lines.stroke(1);
      Lines.line(tile.drawx() + craftAnimLoc, tile.drawy() + 10, tile.drawx() + craftAnimLoc, tile.drawy() + 16);
      Lines.line(tile.drawx() - craftAnimLoc, tile.drawy() - 10, tile.drawx() - craftAnimLoc, tile.drawy() - 16);
      Draw.color();
    }
  },
  drawLayer2(tile){
    entity = tile.ent();
    
    var lens = [9.5, 9.5 , 9.5];
    var armSpeed = 6;
    var armItemSpeed = this.produceTimes[tile.entity.getToggle() + 1] / 20;
    
    //top arms
    var ft1 = Mathf.sin(entity.totalProgress, armSpeed + armItemSpeed, 6);
    var ft2 = Mathf.sin(entity.totalProgress, armSpeed - 2 + armItemSpeed, 8);
    var ft3 = Mathf.sin(entity.totalProgress, armSpeed - 6 + armItemSpeed, 12);
    var rots = [ft1 + 12, ft2 - 94, ft3 - 70];
    
    aclib.legRenderer("ohno-missiles-missile-upgrader-rightarm", tile.drawx() + 16, tile.drawy() + 12.5, 90, 3, rots, lens, -1);
    aclib.legRenderer("ohno-missiles-missile-upgrader-leftarm", tile.drawx() - 16, tile.drawy() + 12.5, 90, 3, rots, lens, 1);
    
    //bottom arms
    ft1 = Mathf.sin(entity.totalProgress, armSpeed + armItemSpeed, 6);
    ft2 = Mathf.sin(entity.totalProgress, armSpeed - 2 + armItemSpeed, 8);
    ft3 = Mathf.sin(entity.totalProgress, armSpeed - 6 + armItemSpeed, 12);
    rots = [ft1 + 8, ft2 - 103, ft3 - 63];
    
    aclib.legRenderer("ohno-missiles-missile-upgrader-leftarm", tile.drawx() + 16, tile.drawy() - 12.5, 90, 3, rots, lens, -1);
    aclib.legRenderer("ohno-missiles-missile-upgrader-rightarm", tile.drawx() - 16, tile.drawy() - 12.5, 90, 3, rots, lens, 1);
  },
  generateIcons(){
    return [
      Core.atlas.find(this.name),
      Core.atlas.find(this.name + "-icon")
    ];
  }
},
/*length of output, input, crafTimes should be same.
if not, I'm not sure which error happens.
length of recipes is not limited now.
output
-first place : array of items      *IF YOU DON't NEED IT, YOU MUST SET NULL*
-second place: array of liquids    *IF YOU DON't NEED IT, YOU MUST SET NULL*
-third place: power                *IF YOU DON't NEED IT, YOU MUST SET NULL*
input
-first place : array of items      *IF YOU DON't NEED IT, YOU MUST SET NULL*
-second place: array of liquids    *IF YOU DON't NEED IT, YOU MUST SET NULL*
-third place: power                *IF YOU DON't NEED IT, YOU MUST SET NULL*
craftTimes
-1=1frame=1/60second
-NOT NULLABLE
[item,amount]
Vanilla item : "item-name"
list: scrap, copper, lead, graphite, coal, titanium, thorium, silicon, plastanium, phase-fabric, surge-alloy,
    spore-pod, sand, blast-compound, pyratite, metaglass
Modded item : "Mod-Name"+"-"+"item-name"
item-name is .json file name
[liquid,amount]
Vanilla liquids : "liquid-name"
Modded liquids :"Mod-Name"+"-"+"liquid-name"
liquid-name is .json file name
*/

{
  _output:[
    [/*items*/ [ ["ohno-missiles-missile-am", 1] ] /*liquids*/, null/*power*/, null],
    [/*items*/ [ ["ohno-missiles-missile-aa", 1] ] /*liquids*/, null/*power*/, null],
    [/*items*/ [ ["ohno-missiles-missile-ic", 1] ] /*liquids*/, null/*power*/, null],
    [/*items*/ [ ["ohno-missiles-missile-emp", 1] ] /*liquids*/, null/*power*/, null],
    [/*items*/ [ ["ohno-missiles-missile-h", 1] ] /*liquids*/, null/*power*/, null],
    [/*items*/ [ ["ohno-missiles-missile-sp", 1] ] /*liquids*/, null/*power*/, null],
    [/*items*/ [ ["ohno-missiles-missile-v", 1] ] /*liquids*/, null/*power*/, null],
    [/*items*/ [ ["ohno-missiles-missile-sh", 1] ] /*liquids*/, null/*power*/, null],
    [/*items*/ [ ["ohno-missiles-missile-n", 1] ]/*liquids*/, null/*power*/, null],
  ],
  _input:[
    [/*items am*/ [ ["ohno-missiles-missile", 2], ["surge-alloy", 2], ["silicon", 10], ["plastanium", 5], ["titanium", 5] ] /*liquids*/, null/*power*/, 16],
    [/*items aa*/ [ ["ohno-missiles-missile", 3], ["blast-compound", 4], ["titanium", 5] ] /*liquids*/, null/*power*/, 17],
    [/*items ic*/ [ ["ohno-missiles-missile", 2], ["pyratite", 8], ["metaglass", 8], ["titanium", 5] ] /*liquids*/, [ ["ohno-missiles-napalm", 36] ] /*power*/,18],
    [/*items emp*/ [ ["ohno-missiles-missile", 2], ["surge-alloy", 4], ["silicon", 12], ["plastanium", 6] ["titanium", 5] ] /*liquids*/, null/*power*/, 18],
    [/*items h*/ [ ["ohno-missiles-missile", 2], ["phase-fabric", 8], ["silicon", 8], ["titanium", 5] ] /*liquids*/, null/*power*/, 15],
    [/*items sp*/ [ ["ohno-missiles-missile", 4], ["blast-compound", 4], ["silicon", 10], ["titanium", 5] ] /*liquids*/, null/*power*/, 23],
    [/*items v*/ [ ["ohno-missiles-missile", 3], ["silicon", 15], ["graphite", 10], ["titanium", 5] ] /*liquids*/, null/*power*/, 23],
    [/*items sh*/ [ ["ohno-missiles-missile", 4], ["blast-compound", 6], ["silicon", 12], ["titanium", 5] ] /*liquids*/, null/*power*/, 25],
    [/*items n*/ [ ["ohno-missiles-missile", 6], ["blast-compound", 10], ["thorium", 5], ["titanium", 5] ] /*liquids*/, null/*power*/, 28],
  ],
  craftTimes:[150, 180, 180, 180, 120, 210, 210, 240, 300],
  //DON'T MODIFY THESE
  output:[],
  input:[],
  itemList:[],
  liquidList:[],
  isSameOutput:[],
  //
});
/*true: enable displaying inventory
false:disable displaying inventory*/
missileUpgrader.enableInv=true;
/*true: dump items and liquids of output according to button
false: dump items and liquids of output unconditionally*/
missileUpgrader.dumpToggle=false;

/*
YOU MUST NOT MODIFY VALUE OF
THESE
configurable=true;
outputsPower=true;
hasItems=true;
hasLiquids=true;
hasPower=true;
*/
//using this without json. not recommanded because can cause error.
missileUpgrader.localizedName = "[#F90800]Ballistic Modification Plant";
missileUpgrader.description = "Takes normal [#F90800]Ballistic Missiles[] and upgrades them to missiles meant specifically for certain missile silos, allowing them to fire faster because they don't need to synthesize the upgraded missiles themselves. Selection is output, cost is bottom right gui. Easer to read in the [?] info. [red]Just note that it's extremely long.";
missileUpgrader.itemCapacity = 69;
missileUpgrader.liquidCapacity = 69;
missileUpgrader.size = 5;
missileUpgrader.craftEffect = Fx.producesmoke;
missileUpgrader.updateEffect = Fx.hitMeltdown;
missileUpgrader.expanded = true;
missileUpgrader.drawLiquidLight = false;
missileUpgrader.layer2 = Layer.power;

missileUpgrader.missileColors = [/*none*/Color.valueOf("565666"), /*am*/Color.valueOf("9EE6FF"), /*aa*/Color.valueOf("CF0A00"), /*inc*/Color.valueOf("F27D00"), /*emp*/Color.valueOf("00A9FF"), /*h*/Color.valueOf("FFBCFB"), /*sp*/Color.valueOf("ffeb0d"), /*v*/Color.valueOf("4EE04E"), /*sh*/Color.valueOf("d620d6"), /*n*/Color.valueOf("7affbd"), /*dump*/Color.valueOf("565666")];
missileUpgrader.topRegions = [];
missileUpgrader.itemRegions = [];
missileUpgrader.produceTimes = [0, 150, 180, 180, 180, 120, 210, 210, 240, 300, 0];

missileUpgrader.requirements(Category.crafting,ItemStack.with(Items.copper, 3000, Items.lead, 2250, Items.silicon, 1500, Items.graphite, 1500, Items.thorium, 2100, Items.titanium, 2250, Items.plastanium, 1600, Items.surgealloy, 1600, Items.phasefabric, 350));
