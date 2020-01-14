const beam = extendedContent(BulletType, "lucifer-beam", {
	Color[] colors = {Pal.lancerLaser.cpy().mul(1f, 1f, 1f, 0.4f), Pal.lancerLaser, Color.white};
      float[] tscales = {1f, 0.7f, 0.5f, 0.2f};
      float[] lenscales = {1f, 1.1f, 1.13f, 1.14f};
      float length = 160f;

      {
        hitEffect = Fx.hitLancer;
        despawnEffect = Fx.none;
        hitSize = 4;
        lifetime = 20f;
        pierce = true;
      }

      @Override
      public float range(){
        return length;
      }

      @Override
      public void init(Bullet b){
        Damage.collideLine(b, b.getTeam(), hitEffect, b.x, b.y, b.rot(), length);
      }

      @Override
      public void draw(Bullet b){
        float f = Mathf.curve(b.fin(), 0f, 0.2f);
        float baseLen = length * f;

        Lines.lineAngle(b.x, b.y, b.rot(), baseLen);
        for(int s = 0; s < 3; s++){
          Draw.color(colors[s]);
          for(int i = 0; i < tscales.length; i++){
            Lines.stroke(7f * b.fout() * (s == 0 ? 1.5f : s == 1 ? 1f : 0.3f) * tscales[i]);
            Lines.lineAngle(b.x, b.y, b.rot(), baseLen * lenscales[i]);
          }
        }
        Draw.reset();
      }
});