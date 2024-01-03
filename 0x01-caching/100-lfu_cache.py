#!/usr/bin/env python3
""" LFUCache module
"""

from base_caching import BaseCaching


class LFUCache(BaseCaching):
    """ LFUCache class
    """

    def __init__(self):
        """ Initialize the LFUCache
        """
        super().__init__()
        self.frequency = {}

    def put(self, key, item):
        """ Add an item to the cache using LFU algorithm
        """
        if key is not None and item is not None:
            if key in self.cache_data:
                # Increment the frequency count for the key
                self.frequency[key] += 1
            else:
                if len(self.cache_data) >= self.MAX_ITEMS:
                    # Find the least frequency used item (LFU)
                    lfu_keys = [k for k, v in self.frequency.items()
                                if v == min(self.frequency.values())]
                    lru_key = min(lfu_keys, key=lambda k: self.cache_data[k])
                    del self.cache_data[lru_key]
                    del self.frequency[lru_key]
                    print("DISCARD:", lru_key)

                self.cache_data[key] = item
                self.frequency[key] = 1

    def get(self, key):
        """ Get an item from the cache by key
        """
        if key is not None and key in self.cache_data:
            # Increment the frequency count for the key
            self.frequency[key] += 1
            return self.cache_data[key]
        return None


if __name__ == "__main__":
    my_cache = LFUCache()

    my_cache.put("A", "Hello")
    my_cache.put("B", "World")
    my_cache.put("C", "Holberton")
    my_cache.put("D", "School")
    my_cache.print_cache()
    print(my_cache.get("B"))
    my_cache.put("E", "Battery")
    my_cache.print_cache()
    my_cache.put("C", "Street")
    my_cache.print_cache()
    print(my_cache.get("A"))
    print(my_cache.get("B"))
    print(my_cache.get("C"))
    my_cache.put("F", "Mission")
    my_cache.print_cache()
    my_cache.put("G", "San Francisco")
    my_cache.print_cache()
    my_cache.put("H", "H")
    my_cache.print_cache()
    my_cache.put("I", "I")
    my_cache.print_cache()
    print(my_cache.get("I"))
    print(my_cache.get("H"))
    print(my_cache.get("I"))
    print(my_cache.get("H"))
    print(my_cache.get("I"))
    print(my_cache.get("H"))
    my_cache.put("J", "J")
    my_cache.print_cache()
    my_cache.put("K", "K")
    my_cache.print_cache()
    my_cache.put("L", "L")
    my_cache.print_cache()
    my_cache.put("M", "M")
    my_cache.print_cache()
