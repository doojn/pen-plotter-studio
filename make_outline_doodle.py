import numpy as np
import cv2
import math
import random
from rembg import remove
from PIL import Image
import io

def generate_organic_edge_doodle(image_path, out_path, num_steps=50000):
    print("Loading image and removing background...")
    # Load and process with rembg
    with open(image_path, "rb") as i:
        input_data = i.read()
    subject_data = remove(input_data)
    img_rgba = Image.open(io.BytesIO(subject_data))
    
    # Convert RGBA to OpenCV format
    img_rgba_cv = np.array(img_rgba)
    img_rgb = cv2.cvtColor(img_rgba_cv, cv2.COLOR_RGBA2RGB)
    
    # Scale down
    max_dim = 800
    h, w = img_rgb.shape[:2]
    if max(h, w) > max_dim:
        scale = max_dim / max(h, w)
        img_rgb = cv2.resize(img_rgb, (int(w * scale), int(h * scale)))
        img_rgba_cv = cv2.resize(img_rgba_cv, (int(w * scale), int(h * scale)))
    h, w = img_rgb.shape[:2]
    
    # Extract alpha mask
    alpha_mask = img_rgba_cv[:, :, 3]
    
    # Apply mask to image (make background white so CLAHE works well on the dark subjects)
    # Actually, black is better for Canny to find the silhouette!
    img_gray = cv2.cvtColor(img_rgb, cv2.COLOR_RGB2GRAY)
    img_gray[alpha_mask < 50] = 0
    
    print("Enhancing details and extracting edges...")
    clahe = cv2.createCLAHE(clipLimit=4.0, tileGridSize=(8,8))
    img_clahe = clahe.apply(img_gray)
    img_filtered = cv2.bilateralFilter(img_clahe, 5, 50, 50)
    
    # Extract edges
    edges = cv2.Canny(img_filtered, 15, 60)
    
    # Create the thick "scent map" of the edges
    scent_map = cv2.GaussianBlur(edges, (15, 15), 0).astype(np.float32)
    scent_map /= (np.max(scent_map) + 1e-5)
    
    # Completely zero out scent in the background to trap the particle inside the subject!
    scent_map[alpha_mask < 50] = 0.0
    
    print("Simulating organic wandering loops...")
    
    # Start at the center of the subject mass
    y_coords, x_coords = np.where(alpha_mask > 200)
    x = float(np.mean(x_coords))
    y = float(np.mean(y_coords))
    
    angle = 0.0
    path = [(x, y)]
    visited = np.zeros((h, w), dtype=np.float32)
    
    step_size = 2.0
    angular_vel = 0.1
    
    for _ in range(num_steps):
        ix, iy = int(x), int(y)
        if 0 <= ix < w and 0 <= iy < h:
            visited[iy, ix] += 0.3
            for dy in [-1, 0, 1]:
                for dx in [-1, 0, 1]:
                    if 0 <= ix+dx < w and 0 <= iy+dy < h:
                        visited[iy+dy, ix+dx] += 0.08
                        
        angular_vel += random.uniform(-0.15, 0.15)
        angular_vel = max(-0.55, min(0.55, angular_vel))
        
        left_angle = angle - 0.6
        right_angle = angle + 0.6
        
        look_dist = 6.0
        lx = int(x + math.cos(left_angle) * look_dist)
        ly = int(y + math.sin(left_angle) * look_dist)
        rx = int(x + math.cos(right_angle) * look_dist)
        ry = int(y + math.sin(right_angle) * look_dist)
        
        score_left = -100
        score_right = -100
        
        # We heavily penalize moving into the background so the particle bounces off the edge
        if 0 <= lx < w and 0 <= ly < h:
            if alpha_mask[ly, lx] < 50:
                score_left = -500
            else:
                score_left = scent_map[ly, lx] * 6.0 - visited[ly, lx] * 2.0
                
        if 0 <= rx < w and 0 <= ry < h:
            if alpha_mask[ry, rx] < 50:
                score_right = -500
            else:
                score_right = scent_map[ry, rx] * 6.0 - visited[ry, rx] * 2.0
            
        if score_left > score_right + 0.2:
            angular_vel -= 0.08
        elif score_right > score_left + 0.2:
            angular_vel += 0.08
            
        # Jump out of a rut if stuck
        current_visit = visited[iy, ix] if 0 <= ix < w and 0 <= iy < h else 0
        if current_visit > 2.5:
            angular_vel *= 0.5
            
        angle += angular_vel
        x += math.cos(angle) * step_size
        y += math.sin(angle) * step_size
        
        # Hard bounds
        if x < 2: x = 2; angle = math.pi - angle
        if x > w-3: x = w-3; angle = math.pi - angle
        if y < 2: y = 2; angle = -angle
        if y > h-3: y = h-3; angle = -angle
        
        path.append((x, y))
        
    print("Generating SVG...")
    svg = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}px" height="{h}px">']
    svg.append('<rect width="100%" height="100%" fill="white"/>')
    
    path_data = [f"M {path[0][0]:.1f} {path[0][1]:.1f}"]
    for px, py in path[1:]:
        path_data.append(f"L {px:.1f} {py:.1f}")
        
    svg.append(f'<path d="{" ".join(path_data)}" fill="none" stroke="black" stroke-width="0.7" />')
    svg.append('</svg>')
    
    with open(out_path, 'w') as f:
        f.write("\n".join(svg))
    print(f"Done! Saved to {out_path}")

if __name__ == '__main__':
    generate_organic_edge_doodle(
        '/Users/njoodalbawardi/.gemini/antigravity/brain/89ffb760-aa65-420e-9bb8-7bac22209bf6/.user_uploaded/media_1790855638545.jpg',
        '/Users/njoodalbawardi/Documents/antigravity/clever-pasteur/cat_lady_outline.svg'
    )
