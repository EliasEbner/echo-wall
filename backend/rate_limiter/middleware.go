package rate_limiter

import (
	"net"
	"net/http"
	"strconv"
	"sync"
)

var ipLimiters = struct {
	sync.Mutex
	m map[string]*Bucket
}{m: make(map[string]*Bucket)}

func getLimiter(ip string) *Bucket {
	ipLimiters.Lock()
	defer ipLimiters.Unlock()

	bucket, ok := ipLimiters.m[ip]
	if !ok {
		bucket = New( /* burst: */ 1 /* requests/sec: */, 0.5)
		ipLimiters.m[ip] = bucket
	}

	return bucket
}

func RateLimit(next http.Handler) http.Handler {
	return http.HandlerFunc(func(writer http.ResponseWriter, request *http.Request) {
		ip, _, _ := net.SplitHostPort(request.RemoteAddr)
		if !getLimiter(ip).Allow() {
			writer.Header().Set("Retry-After", strconv.FormatFloat(float64(1)/float64(getLimiter(ip).rate), 'f', 1, 64))
			http.Error(writer, "Too Many Requests", http.StatusTooManyRequests)
			return
		}

		next.ServeHTTP(writer, request)
	})
}
