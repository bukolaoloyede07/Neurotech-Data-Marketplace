;; Brain-Computer Interface (BCI) Data Contract

(define-data-var next-data-id uint u0)

(define-map bci-data
  { data-id: uint }
  {
    owner: principal,
    data-hash: (buff 32),
    timestamp: uint,
    data-type: (string-ascii 20)
  }
)

(define-public (submit-bci-data (data-hash (buff 32)) (data-type (string-ascii 20)))
  (let
    ((data-id (+ (var-get next-data-id) u1)))
    (var-set next-data-id data-id)
    (ok (map-set bci-data
      { data-id: data-id }
      {
        owner: tx-sender,
        data-hash: data-hash,
        timestamp: block-height,
        data-type: data-type
      }
    ))
  )
)

(define-read-only (get-bci-data (data-id uint))
  (map-get? bci-data { data-id: data-id })
)

(define-read-only (get-next-data-id)
  (var-get next-data-id)
)

