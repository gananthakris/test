(global-set-key "\e " 'set-mark-command) ;Compatible with VEMacs.

(setq default-major-mode 'text-mode)
(line-number-mode 1)

(setq next-line-add-newlines ())

(setq Info-default-directory-list (cons "~/cs571/info" Info-default-directory-list))
(setq url-be-asynchronous 1)
(setq gnus-use-generic-path t)

(setq calendar-latitude 42.1)
(setq calendar-longitude -75.8)
(setq calendar-location-name "Binghamton, NY")

(add-hook 'c-mode-hook 
	  '(lambda ()
	     (setq c-tab-always-indent nil)
	     (setq c-label-offset 0)	;Ok for case labels.  
					;Manually indent goto labels.
	     (setq c-continued-brace-offset 2)
	     (setq c-continued-statement-offset 2)))


;Why does view-mode undefine useful keys?
(add-hook 'view-hook
	  '(lambda ()
	     (local-set-key  "\C-k" 'kill-line)
	     (local-set-key "\C-a" 'beginning-of-line)
	     (local-set-key "\C-e" 'end-of-line)))


(add-hook 'text-mode-hook
	  '(lambda ()
	     (auto-fill-mode 1)
	     (set-fill-column 76)))
         
(display-time)
(add-hook `comint-output-filter-functions
	  `comint-watch-for-password-prompt)
(add-hook 'comint-output-filter-functions
	  'comint-strip-ctrl-m)

(global-font-lock-mode 1)
