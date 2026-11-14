// Aventador SVJ LP 770-4 model: every part shares a few atlas materials, so give
// each part its own named material (paint, wheels, calipers, lamp glows).
import * as THREE from "three";

export const SVJ_HEAD_LENS = "svj_glow_pos";
export const SVJ_TAIL_LENS = "svj_glow_back";
export const SVJ_BRAKE_LENS = "svj_glow_brake";

/** Material name for an SVJ part, from its mesh/node name. */
export function svjPartMaterial(name: string): string | null {
  const n = name.toLowerCase();
  if (n.includes("caliper")) return "svj_caliper";
  if (/wheel.*tyres/.test(n)) return "svj_tyre";
  if (/wheel.*rims/.test(n)) return "svj_rim";
  if (n.includes("carpaint")) return "svj_paint";
  if (n.includes("lights_brakes")) return SVJ_BRAKE_LENS;
  if (n.includes("lights_position_back")) return SVJ_TAIL_LENS;
  if (n.includes("lights_position_front")) return SVJ_HEAD_LENS;
  if (n.includes("lights_reverse")) return "svj_reverse";
  if (n.includes("glass_light")) return "svj_lamp_glass";
  if (n.includes("glass_window")) return "svj_window";
  if (n.includes("chassis_rims")) return "svj_chassis_metal";
  return null;
}

export function fixSvj(root: THREE.Object3D) {
  const made = new Map<string, THREE.Material>();
  root.traverse((o) => {
    const m = o as THREE.Mesh;
    if (!m.isMesh || Array.isArray(m.material)) return;
    let label = m.name;
    for (let p = m.parent; p && label.length < 400; p = p.parent) label += " " + p.name;
    const name = svjPartMaterial(label);
    if (!name) return;
    let mat = made.get(name);
    if (!mat) {
      const c = (m.material as THREE.MeshStandardMaterial).clone();
      c.name = name;
      if (name === "svj_reverse") { c.emissive?.set(0); c.emissiveIntensity = 0; }
      if (name === "svj_lamp_glass") { c.opacity = 0.25; c.depthWrite = false; }
      mat = c;
      made.set(name, mat);
    }
    m.material = mat;
  });
}
