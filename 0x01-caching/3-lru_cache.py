#!/usr/bin/env python3
""" LRUCache module
"""

from base_caching import BaseCaching


class LRUCache(BaseCaching):
    """ LRUCache class
    """

    def __init__(self):
        """ Initialize the LRUCache
        """
        super().__init__()
        self.order = []

    def put(self, key, item):
        """ Add an item to the cache using LRU algorithm
        """
        if key is not None and item is not None:
            if key in self.cache_data:
                # Move the key to the end to signify it's recently used
                self.order.remove(key)
                self.order.append(key)
            else:
                if len(self.cache_data) >= self.MAX_ITEMS:
                    # Discard the least recently used item (LRU)
                    lru_key = self.order.pop(0)
                    del self.cache_data[lru_key]
                    print("DISCARD:", lru_key)

                self.cache_data[key] = item
                self.order.append(key)

    def get(self, key):
        """ Get an item from the cache by key
        """
        if key is not None and key in self.cache_data:
            # Move the key to the end to signify it's recently used
            self.order.remove(key)
            self.order.append(key)
            return self.cache_data[key]
        return None
