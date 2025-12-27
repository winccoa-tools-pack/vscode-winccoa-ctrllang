/**
 * Test Fixture: Cross-File Resolution
 *
 * Dieses File nutzt Funktionen aus TestLibrary.ctl
 */

#uses "TestLibrary" //TODO COPILOT: Ich kann nicht auf TestLibrary klicken um auf die Definition der Datei zu springen

main()
{
  // TEST: Go-to-Def auf 'libraryFunction' -> sollte zu TestLibrary.ctl springen
  // TEST: Hover auf 'libraryFunction' -> sollte Signatur anzeigen
  int result = libraryFunction(10, 20);

  // TEST: Go-to-Def auf 'LibraryStruct' -> sollte zu TestLibrary.ctl springen
  // TEST: Hover auf 'data' -> sollte Typ 'LibraryStruct' anzeigen
  LibraryStruct data;

  // TEST: Go-to-Def auf 'data.value' -> sollte zum Field in TestLibrary.ctl springen
  data.value = 42;

  // TEST: Go-to-Def auf 'data.label' -> sollte zum Field in TestLibrary.ctl springen
  data.label = "test";

  // TEST: Go-to-Def auf 'LibraryHelper' -> sollte zu TestLibrary.ctl springen
  // TEST: Hover auf 'helper' -> sollte Typ 'LibraryHelper' anzeigen
  LibraryHelper helper = new LibraryHelper();

  // TEST: Go-to-Def auf 'helper.getMessage' -> sollte zur Methode in TestLibrary.ctl springen
  // TEST: Hover auf 'message' -> sollte Typ 'string' anzeigen
  string message = helper.getMessage();

  DebugN("Cross-file test completed");
}
