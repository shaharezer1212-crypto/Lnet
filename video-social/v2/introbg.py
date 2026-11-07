import sys, numpy as np
sys.path.insert(0,'.')
from PIL import Image
import grade as G
im=Image.open('../../assets/img/scene-office.webp').convert('RGB')
w,h=im.size; cw=int(h*9/16); x0=(w-cw)//2+60
bg=im.crop((x0,0,x0+cw,h)).resize((1080,1920),Image.LANCZOS)
a=G.grade(np.array(bg,np.float32)); paper=G.grade(np.full((1920,1080,3),250,np.float32))
fa=paper*0.22+a*0.78
N=180
for i in range(N):
    k=1.0 if i<N-8 else 1-(i-(N-8)+1)/8
    Image.fromarray(np.clip(paper*(1-k)+fa*k,0,255).astype(np.uint8)).save(f'base/f{i:04d}.jpg',quality=93)
