import math
import numpy as np
import librosa
import os

def load_ocean_data(filepath, is_old_format=False):
    data_points = []
    with open(filepath, 'r') as f:
        for line in f:
            if line.startswith('#') or line.startswith('Y'): continue
            parts = line.split()
            if not is_old_format:
                if len(parts) < 12: continue
                hr = int(parts[3])
                mn = int(parts[4])
                wvht = float(parts[8])
                mwd = float(parts[11])
            else:
                if len(parts) < 11: continue
                hr = int(parts[3])
                mn = 0
                wvht = float(parts[7])
                mwd = float(parts[10])
                
            m_total = hr * 60 + mn
            if wvht > 90 or mwd > 900: continue
            data_points.append((m_total, wvht, mwd))
            
    data_points.sort(key=lambda x: x[0])
    
    m_arr = np.array([x[0] for x in data_points])
    wvht_arr = np.array([x[1] for x in data_points])
    mwd_arr = np.array([x[2] for x in data_points])
    
    wvht_interp = np.interp(range(1440), m_arr, wvht_arr)
    mwd_interp = np.interp(range(1440), m_arr, mwd_arr)
    
    return wvht_interp, mwd_interp

def get_song_turbulence(filepath, num_cells=1444):
    y, sr = librosa.load(filepath, sr=22050)
    rms = librosa.feature.rms(y=y)[0]
    
    x_orig = np.linspace(0, 1, len(rms))
    x_new = np.linspace(0, 1, num_cells)
    rms_interp = np.interp(x_new, x_orig, rms)
    
    min_rms = np.min(rms_interp)
    max_rms = np.max(rms_interp)
    
    if max_rms > min_rms:
        rms_norm = (rms_interp - min_rms) / (max_rms - min_rms)
    else:
        rms_norm = np.ones(num_cells) * 0.5
        
    song_turb = 0.2 + (rms_norm * 2.8)
    return song_turb

def generate_svg():
    path_2025 = '/Users/njoodalbawardi/Documents/antigravity/clever-pasteur/ocean_data_may22.txt'
    path_2000 = '/Users/njoodalbawardi/Documents/antigravity/clever-pasteur/ocean_data_2000.txt'
    path_2002 = '/Users/njoodalbawardi/Documents/antigravity/clever-pasteur/ocean_data_2002.txt'
    song_path = '/Users/njoodalbawardi/.gemini/antigravity/brain/89ffb760-aa65-420e-9bb8-7bac22209bf6/.user_uploaded/uploaded_media_1790796658270.mp3'
    out_path = '/Users/njoodalbawardi/Documents/antigravity/clever-pasteur/southern_shores_temp.svg'
    
    wv_25, mwd_25 = load_ocean_data(path_2025, False)
    wv_00, mwd_00 = load_ocean_data(path_2000, True)
    wv_02, mwd_02 = load_ocean_data(path_2002, True)
    
    song_turb = get_song_turbulence(song_path, 1444)
    
    combined_wv = []
    for m in range(1440):
        if mwd_25[m] > 90:
            mod_wv = wv_02[m]
            mod_mwd = mwd_02[m]
        else:
            mod_wv = wv_00[m]
            mod_mwd = mwd_00[m]
            
        if mod_mwd < 90:
            val = wv_25[m] - mod_wv
        else:
            val = wv_25[m] + mod_wv
            
        combined_wv.append(val)
        
    combined_wv = np.array(combined_wv)
    min_wv = np.min(combined_wv)
    max_wv = np.max(combined_wv)
    
    cols = 38
    rows = 38
    cell_size = 18
    
    w = cols * cell_size
    h = rows * cell_size
    
    svg = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}px" height="{h}px">']
    svg.append(f'<rect width="100%" height="100%" fill="white"/>')
    
    # We will store a SINGLE path for the entire drawing
    path_data = []
    num_points = 24
    
    for row in range(rows):
        # Snake path: left-to-right on even rows, right-to-left on odd rows
        if row % 2 == 0:
            cols_order = range(cols)
        else:
            cols_order = range(cols - 1, -1, -1)
            
        for col in cols_order:
            i = row * cols + col
            m = min(i, 1439)
            
            t_norm = 0.5 - 0.5 * math.cos((m - 270) * 2 * math.pi / 1440)
            max_r = cell_size / 2.0 * 0.95 
            r = max_r * (0.15 + 0.85 * t_norm)
            
            cx = col * cell_size + cell_size / 2.0
            cy = row * cell_size + cell_size / 2.0
            
            wvht = combined_wv[m]
            mwd = mwd_25[m]
            w_norm = (wvht - min_wv) / (max_wv - min_wv) if max_wv > min_wv else 0.5
            
            angle_rad = math.radians(mwd - 90)
            vx = math.cos(angle_rad)
            vy = math.sin(angle_rad)
            
            warp_amount = r * 0.8 * w_norm * song_turb[i]
            
            # Draw the loop for this grid cell (+1 to close the loop)
            for p in range(num_points + 1):
                alpha = p * 2 * math.pi / num_points
                px = math.cos(alpha)
                py = math.sin(alpha)
                
                dot = px * vx + py * vy
                x = cx + (r * px) + (vx * dot * warp_amount)
                y = cy + (r * py) + (vy * dot * warp_amount)
                
                if len(path_data) == 0:
                    path_data.append(f"M {x:.2f} {y:.2f}")
                else:
                    path_data.append(f"L {x:.2f} {y:.2f}")

    # Write the single massive continuous line
    svg.append(f'<path d="{" ".join(path_data)}" fill="none" stroke="black" stroke-width="0.8" />')
    svg.append('</svg>')
    
    with open(out_path, 'w') as f:
        f.write("\n".join(svg))
        
if __name__ == '__main__':
    generate_svg()
