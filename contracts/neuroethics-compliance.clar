;; Neuroethics Compliance Contract

(define-constant CONTRACT_OWNER tx-sender)

(define-map ethical-guidelines
  { guideline-id: uint }
  { description: (string-utf8 500) }
)

(define-map data-compliance
  { data-id: uint }
  { compliant: bool }
)

(define-public (add-guideline (guideline-id uint) (description (string-utf8 500)))
  (begin
    (asserts! (is-eq tx-sender CONTRACT_OWNER) (err u403))
    (ok (map-set ethical-guidelines
      { guideline-id: guideline-id }
      { description: description }
    ))
  )
)

(define-public (mark-compliant (data-id uint))
  (let
    ((data (unwrap! (contract-call? .bci-data get-bci-data data-id) (err u404))))
    (asserts! (is-eq tx-sender CONTRACT_OWNER) (err u403))
    (ok (map-set data-compliance
      { data-id: data-id }
      { compliant: true }
    ))
  )
)

(define-read-only (is-compliant (data-id uint))
  (default-to
    false
    (get compliant (map-get? data-compliance { data-id: data-id }))
  )
)

(define-read-only (get-guideline (guideline-id uint))
  (map-get? ethical-guidelines { guideline-id: guideline-id })
)

