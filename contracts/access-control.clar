;; Access Control Contract

(define-map data-permissions
  { data-id: uint, user: principal }
  { can-access: bool }
)

(define-public (grant-access (data-id uint) (user principal))
  (let
    ((data (unwrap! (contract-call? .bci-data get-bci-data data-id) (err u404))))
    (asserts! (is-eq tx-sender (get owner data)) (err u403))
    (ok (map-set data-permissions
      { data-id: data-id, user: user }
      { can-access: true }
    ))
  )
)

(define-public (revoke-access (data-id uint) (user principal))
  (let
    ((data (unwrap! (contract-call? .bci-data get-bci-data data-id) (err u404))))
    (asserts! (is-eq tx-sender (get owner data)) (err u403))
    (ok (map-delete data-permissions { data-id: data-id, user: user }))
  )
)

(define-read-only (check-access (data-id uint) (user principal))
  (let
    ((data (unwrap! (contract-call? .bci-data get-bci-data data-id) (err u404))))
    (ok (or
      (is-eq (get owner data) user)
      (default-to false (get can-access (map-get? data-permissions { data-id: data-id, user: user })))
    ))
  )
)

