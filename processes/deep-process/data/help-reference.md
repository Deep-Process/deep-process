# Deep-Process v3.6 — Przewodnik Pomocy / Help Guide

## SZYBKI START / QUICK START

### Pierwszy raz? Zacznij tutaj:

1. **Uruchom system** — zobaczysz ekran startowy
2. **Wpisz [N]** — aby utworzyć nowy proces
3. **Wybierz typ procesu** — z listy dostępnych
4. **Podaj informacje** — które system poprosi
5. **Postępuj według wskazówek** — system prowadzi krok po kroku

### Wracasz po przerwie?

1. **Uruchom system** — zobaczysz ekran przeglądu
2. **Sprawdź status** — czy są artefakty do aktualizacji
3. **Wpisz [S]** — aby wybrać proces do kontynuacji
4. **Kontynuuj pracę** — od miejsca gdzie skończyłeś

---

## SŁOWNIK POJĘĆ / GLOSSARY

### Podstawowe terminy

| Termin | Co to znaczy | Przykład |
|--------|--------------|----------|
| **Proces** | Zdefiniowany przepływ pracy | "Onboarding klienta" |
| **Instancja** | Konkretne wykonanie procesu | "Onboarding dla firmy ABC" |
| **Artefakt** | Dokument wygenerowany w procesie | "Umowa z klientem ABC" |
| **Faza** | Etap w cyklu pracy | Przegląd, Planowanie, Tworzenie... |

### Statusy artefaktów

| Status | Ikona | Co oznacza | Co robić |
|--------|-------|------------|----------|
| **Gotowy** | ✅ | Artefakt zatwierdzony | Nic, wszystko OK |
| **Do aktualizacji** | 🔄 | Źródło się zmieniło | Wybierz [1] Aktualizuj |
| **Zablokowany** | 🚫 | Czeka na inny problem | Rozwiąż blokujący problem |
| **Czeka na decyzję** | ⏳ | Wykryto konflikt | Wybierz [2] Decyzje |
| **Błędny** | ❌ | Walidacja nie przeszła | Wybierz [3] Błędy |

### Fazy cyklu pracy

| Faza | Cel | Co robisz |
|------|-----|-----------|
| **PRZEGLĄD** | Zobacz status | Przeglądasz, wybierasz akcję |
| **PLANOWANIE** | Przygotuj zadanie | Zatwierdzasz lub modyfikujesz plan |
| **TWORZENIE** | Generuj treść | Czekasz, system pracuje |
| **SPRAWDZANIE** | Weryfikuj jakość | Przeglądasz wyniki testów |
| **ZAPISYWANIE** | Zatwierdź i zapisz | Potwierdzasz zapis na dysk |

---

## NAWIGACJA / NAVIGATION

### Jak się poruszać

| Chcesz... | Wpisz | Z jakiego ekranu |
|-----------|-------|------------------|
| Zobaczyć status | (automatycznie) | Start/Przegląd |
| Utworzyć nowy proces | [N] | Przegląd |
| Zmienić aktywny proces | [S] | Przegląd |
| Zaktualizować artefakty | [1] | Przegląd |
| Rozwiązać konflikt | [2] | Przegląd |
| Zobaczyć błędy | [3] | Przegląd |
| Utworzyć nowy artefakt | [4] | Przegląd |
| **Szybka edycja** | **[E]** | Przegląd |
| Uruchomić audyt | [A] | Przegląd |
| **Zmienić tryb wyświetlania** | **[X]** | Przegląd |
| Zobaczyć pomoc | [H] | Każdy ekran |
| Wyjść / wrócić | [Q] | Każdy ekran |

### Jak wrócić do początku

Z **każdego miejsca** możesz wpisać **[Q]** aby:
- Zapisać bieżący stan
- Wrócić do ekranu przeglądu
- Nie stracić postępu

### Jak cofnąć akcję

- **Przed zapisaniem:** Wpisz [N] lub [Q] aby anulować
- **Po zapisaniu:** System tworzy kopie zapasowe w `.deep-process/backups/`
- **Punkt decyzji:** Możesz odłożyć decyzję wpisując [Q]

---

## SZYBKA EDYCJA [E]

### Co to jest?

Tryb do drobnych poprawek bez przechodzenia pełnej pętli 5 faz.
Zamiast: PRZEGLĄD → PLANOWANIE → TWORZENIE → SPRAWDZANIE → ZAPISYWANIE
Masz: PRZEGLĄD → EDYCJA → MINI-WALIDACJA → ZAPIS

### Kiedy używać?

| Użyj Quick Edit ✅ | Użyj pełnej edycji ❌ |
|-------------------|----------------------|
| Literówki | Nowe sekcje |
| Formatowanie | Zmiana kluczowych faktów |
| Drobne poprawki | Zmiany wpływające na inne pliki |
| Aktualizacja dat | Znaczące zmiany treści |

### Jak działa?

1. Wybierz [E] z menu przeglądu
2. Wybierz artefakt do edycji (tylko COMMITTED)
3. Edytuj linie tekstu
4. System sprawdza czy zmiany są bezpieczne
5. Jeśli tak — szybki zapis bez pełnej walidacji
6. Jeśli nie — przekierowanie do pełnej edycji

---

## TRYBY WYŚWIETLANIA [X]

### Dostępne tryby / Available modes

| Tryb | Opis | Dla kogo |
|------|------|----------|
| **Przyjazny** | Ukrywa szczegóły techniczne | Codzienne użycie |
| **Ekspercki** | Pokazuje wszystko | Zaawansowani użytkownicy |

### Co ukrywa tryb przyjazny?

- `saga_id`, `dp_id` i inne identyfikatory wewnętrzne
- Numery metod (pokazuje tylko nazwy)
- Pełne ścieżki plików (pokazuje nazwy)
- Szczegóły transakcji

### Jak przełączyć? / How to switch?

1. Wybierz [X] z menu przeglądu
2. Wybierz tryb [1] lub [2]
3. System zapamięta Twój wybór między sesjami

---

## TYPOWE SCENARIUSZE / COMMON SCENARIOS

### Scenariusz 1: Coś się zmieniło w źródle

```
SYTUACJA:
  Widzisz: 🔄 Do aktualizacji: 2

CO SIĘ STAŁO:
  Plik źródłowy (np. wizja projektu) został zmodyfikowany.
  Artefakty które na nim bazują są teraz nieaktualne.

CO ROBIĆ:
  1. Wpisz [1] Aktualizuj
  2. System pokaże które pliki trzeba odświeżyć
  3. Zatwierdź plan aktualizacji [Y]
  4. Poczekaj na regenerację
  5. Sprawdź i zapisz wyniki
```

### Scenariusz 2: System wykrył konflikt

```
SYTUACJA:
  Widzisz: ⏳ Czeka na decyzję: 1

CO SIĘ STAŁO:
  Dwa dokumenty zawierają sprzeczne informacje.
  System nie wie która wersja jest prawidłowa.

CO ROBIĆ:
  1. Wpisz [2] Decyzje
  2. Przeczytaj opis konfliktu
  3. Zobacz dostępne opcje [A], [B], ...
  4. Wybierz opcję zgodną z Twoim zamiarem
  5. System zaktualizuje odpowiednie pliki
```

### Scenariusz 3: Walidacja nie przeszła

```
SYTUACJA:
  Widzisz: ❌ Błędne: 1

CO SIĘ STAŁO:
  Artefakt nie spełnił kryteriów jakości.
  Może być niespójny, niekompletny lub sprzeczny.

CO ROBIĆ:
  1. Wpisz [3] Błędy
  2. Przeczytaj listę problemów
  3. Wpisz [P] Popraw
  4. System pomoże naprawić błędy
  5. Walidacja uruchomi się ponownie
```

### Scenariusz 4: Chcę kontynuować wczorajszą pracę

```
SYTUACJA:
  Wróciłeś po przerwie, masz kilka procesów w toku.

CO ROBIĆ:
  1. Uruchom system - zobaczysz ekran przeglądu
  2. Sprawdź listę aktywnych procesów
  3. Wpisz [S] Przełącz
  4. Wybierz numer procesu który chcesz kontynuować
  5. System załaduje kontekst i pokaże gdzie skończyłeś
```

### Scenariusz 5: Mam literówkę do poprawienia

```
SYTUACJA:
  Zauważyłeś literówkę w zatwierdzonym artefakcie.
  Nie chcesz przechodzić pełnej pętli dla drobnej poprawki.

CO ROBIĆ:
  1. Z ekranu przeglądu wpisz [E] Szybka edycja
  2. Wybierz artefakt z listy (musi być COMMITTED)
  3. System pokaże treść z numerami linii
  4. Wpisz [L] i numer linii do zmiany
  5. Podaj poprawioną treść
  6. Wpisz [S] aby zapisać
  7. Mini-walidacja sprawdzi czy zmiany są bezpieczne
  8. Gotowe - bez pełnej walidacji!
```

### Scenariusz 6: Chcę zobaczyć więcej szczegółów

```
SYTUACJA:
  Potrzebujesz informacji technicznych (ID, ścieżki, numery metod).

CO ROBIĆ:
  1. Z ekranu przeglądu wpisz [X] Zmień tryb
  2. Wybierz [2] Ekspercki
  3. System pokaże pełne szczegóły techniczne
  4. Aby wrócić do uproszczonego widoku: [X] → [1]
```

---

## ROZWIĄZYWANIE PROBLEMÓW / TROUBLESHOOTING

### "Nie wiem co wpisać"

→ Wpisz **[H]** — zawsze dostaniesz pomoc kontekstową

### "Chcę wrócić do menu głównego"

→ Wpisz **[Q]** — z każdego miejsca wrócisz do przeglądu

### "Zrobiłem błąd, chcę cofnąć"

→ Jeśli nie zapisałeś: wpisz **[N]** lub **[Q]**
→ Jeśli zapisałeś: kopie są w `.deep-process/backups/`

### "Nie rozumiem komunikatu błędu"

→ Wpisz **[H]** — pomoc wyjaśni co oznacza błąd

### "System się zawiesił / nie odpowiada"

→ Poczekaj — generowanie może trwać
→ Jeśli długo: przerwij (Ctrl+C) i uruchom ponownie
→ Stan jest zapisany, nic nie stracisz

---

## SKRÓTY KLAWISZOWE / KEYBOARD SHORTCUTS

| Klawisz | Akcja | Dostępne gdzie |
|---------|-------|----------------|
| [N] | Nowy proces/Nie | Przegląd, potwierdzenia |
| [S] | Przełącz proces | Przegląd |
| [E] | Szybka edycja | Przegląd |
| [X] | Zmień tryb wyświetlania | Przegląd |
| [Y] | Tak/Zatwierdź | Potwierdzenia |
| [H] | Pomoc | Wszędzie |
| [Q] | Wyjdź/Wróć | Wszędzie |
| [A] | Audyt | Przegląd |
| [1-9] | Wybór z listy | Listy, menu |
| ENTER | Potwierdź/Kontynuuj | Wszędzie |

### Skróty w trybie Quick Edit [E]

| Klawisz | Akcja |
|---------|-------|
| [L] | Zmień linię |
| [D] | Dodaj tekst |
| [R] | Usuń linię |
| [P] | Podgląd zmian |
| [S] | Zapisz zmiany |

---

## KONTAKT I WSPARCIE / SUPPORT

Masz pytanie którego nie ma w pomocy?
→ Sprawdź dokumentację: `workflow.md`
→ Zobacz schematy: `data/*.yaml`
→ Przejrzyj przykłady w `processes/`
