package rate_limiter

import (
	"sync"
	"time"
)

type Bucket struct {
	mutex  sync.Mutex
	burst  int
	tokens int
	rate   float32
	last   time.Time
}

func New(burst int, rate float32) *Bucket {
	return &Bucket{
		burst:  burst,
		tokens: burst,
		rate:   rate,
		last:   time.Now(),
	}
}

func (bucket *Bucket) Allow() bool {
	bucket.mutex.Lock()
	defer bucket.mutex.Unlock()

	now := time.Now()
	elapsed := now.Sub(bucket.last).Seconds()
	bucket.tokens += int(elapsed * float64(bucket.rate))
	if bucket.tokens > bucket.burst {
		bucket.tokens = bucket.burst
	}

	bucket.last = now

	if bucket.tokens >= 1 {
		bucket.tokens--
		return true
	}

	return false
}
