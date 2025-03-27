export function Toolbar() {
  return (
    <div class="fixed bottom-0 right-0 z-50 flex w-full justify-end overflow-hidden bg-[--blue-france-975-75] p-2">
      <button
        class="fr-btn fr-mr-2w fr-btn--secondary bg-white"
        _={`
            on click
              if #refusalModal.classList.contains('hidden') is false
                  add .hidden to #refusalModal
              end

              if #acceptModal.classList.contains('hidden')
                remove .hidden from #acceptModal
              else
                add .hidden to #acceptModal
              end
          `}
      >
        ✅ Accepter
      </button>

      <button
        class="fr-btn fr-mr-2w fr-btn--secondary bg-white"
        _={`
        on click 
          if #acceptModal.classList.contains('hidden') is false
            add .hidden to #acceptModal
          end

          if #refusalModal.classList.contains('hidden')
            remove .hidden from #refusalModal
          else
            add .hidden to #refusalModal
          end
      `}
      >
        ❌ Refuser
      </button>
      <a
        href="#exchange_moderation"
        class="fr-btn fr-btn--secondary bg-white"
        onclick="document.getElementById('exchange_details').setAttribute('open', ''); return true;"
      >
        💬 Voir les échanges
      </a>
    </div>
  );
}
