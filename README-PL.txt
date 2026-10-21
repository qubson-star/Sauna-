KARMIENIA - APLIKACJA NA IPHONE'A (PWA)
=======================================

CO POTRAFI
- licznik: ile minęło od ostatniego karmienia (odświeża się sam)
- dodawanie karmienia: ilość w ml (szybki wybór 60-180) i godzina
  (pole godziny samo pokazuje "teraz"; po ręcznej zmianie zostaje Twoja godzina)
- edycja i usuwanie wpisów
- suma i liczba karmień z ostatnich 24 godzin, średnia porcja, suma od północy
- wykres 7 dni z przewijaniem do wcześniejszych tygodni
- historia: wybrany dzień, ostatnie 24 h, wszystkie (pogrupowane po dniach)
- tryb nocny: automatycznie wg ustawień telefonu albo ręcznie (przycisk w prawym górnym rogu)
- kopia JSON, wczytanie kopii, eksport CSV (z informacją, kiedy była ostatnia kopia)
- działa offline po zainstalowaniu

INSTALACJA NA IPHONIE
1. Wgraj zawartość tego ZIP-a na serwis z HTTPS (np. Netlify Drop, GitHub Pages).
   Plik index.html musi być w katalogu głównym.
2. Otwórz adres w Safari > Udostępnij > Dodaj do ekranu początkowego.
3. Uruchamiaj aplikację z ikony na ekranie początkowym.

AKTUALIZACJA Z POPRZEDNIEJ WERSJI
- Podmień pliki pod TYM SAMYM adresem. Zapisane karmienia zostają
  (aplikacja czyta ten sam magazyn danych co poprzednia wersja).
- Przed podmianą na wszelki wypadek zrób "Zapisz kopię" w starej wersji.
- Zainstalowana aplikacja może pokazać nową wersję dopiero przy drugim
  otwarciu (pierwsze otwarcie pobiera aktualizację). Kolejne aktualizacje
  docierają od razu, gdy telefon ma internet.

DANE
- Wpisy są tylko na tym telefonie (pamięć przeglądarki). Nic nie jest wysyłane.
- Na iPhonie aplikacja z ekranu początkowego i Safari mają OSOBNE dane.
  Używaj jednego z nich, najlepiej aplikacji z ekranu początkowego.
- Wyczyszczenie danych Safari usuwa historię. Regularnie rób "Zapisz kopię".

PLIKI
- index.html - cała aplikacja (fonty są wbudowane, działa też otwarta z dysku)
- sw.js - tryb offline i aktualizacje
- manifest.webmanifest, ikony - instalacja na ekranie początkowym
- licencje-fontow/ - licencje fontów Bangers i Mali (SIL Open Font License)
