import pyparadigm as pp

class AreaTracker:
    def __init__(self):
        self.areas = {}
        
    def area(self, name):
        new_area = Area()
        self.areas[name] = new_area
        return new_area

    def find_area(self, pos):
        for name, area in self.areas.items():
            if area.rect is not None:
                if area.rect.collidepoint(pos):
                    return (name, 
                            (pos[0] - area.rect.x, pos[1] - area.rect.y),
                            area.rect)


class Area:
    def __init__(self):
        self.rect = None
        self.child = None

    def __call__(self, child):
        self.child = pp.surface_composition._wrap_children(child)
        return self

    def _draw(self, surface, rect):
        # print("given:", rect)
        self.rect = rect if not type(self.child) == pp.Surface\
            else self.child.compute_render_rect(rect)
        # print("used:", self.rect)
        if self.child:
            self.child._draw(surface, rect)
