import { useState, useEffect } from 'react';
import { getGems } from '../services/api';
import GEM_IMAGES from '../data/gemImages.js';

export default function useGems() {
  const [gems,    setGems]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    setLoading(true);
    getGems()
      .then(({ data }) => {
        // Merge API gems with local images
        const merged = (data.gems || []).map(gem => ({
          ...gem,
          images: GEM_IMAGES[gem.id] || gem.images || []
        }));
        setGems(merged);
      })
      .catch(err => {
        setError(err.response?.data?.message || 'Failed to load gems.');
      })
      .finally(() => setLoading(false));
  }, []);

  return { gems, loading, error };
}
