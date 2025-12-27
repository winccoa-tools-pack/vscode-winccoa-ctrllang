/**
 * Test Fixture: Class Inheritance
 *
 * Testet:
 * - Base class members
 * - Derived class members
 * - Method overriding
 */

// Base Class
class Animal
{
  // TEST: Hover auf 'm_name' -> sollte Typ 'string' anzeigen
  protected string m_name;

  // TEST: Hover auf 'm_age' -> sollte Typ 'int' anzeigen
  protected int m_age;

  // TEST: Hover auf 'Animal' -> sollte Constructor-Signatur anzeigen
  public Animal(string name)
  {
    // TEST: Go-to-Def auf 'm_name' -> sollte zum Member in Zeile 12 springen
    // TEST: Go-to-Def auf 'name' -> sollte zum Parameter springen
    m_name = name;

    // TEST: Go-to-Def auf 'm_age' -> sollte zum Member in Zeile 15 springen
    m_age = 0;
  }

  // TEST: Hover auf 'getName' -> sollte Signatur 'string getName()' anzeigen
  public string getName()
  {
    // TEST: Go-to-Def auf 'm_name' -> sollte zum Member springen
    return m_name;
  }

  // TEST: Hover auf 'makeSound' -> sollte Signatur 'string makeSound()' anzeigen
  public string makeSound()
  {
    return "Generic animal sound";
  }
};

// Derived Class
class Dog : Animal
{
  private string m_breed;

  public Dog(string name, string breed) : Animal(name)
  {
    m_breed = breed;
  }

  public string getBreed()
  {
    return m_breed;
  }

  // Override
  public string makeSound()
  {
    return "Woof!";
  }

  // Dog-specific method
  public void wagTail()
  {
    DebugN(m_name + " is wagging tail");
  }
};

main()
{
  // Test: Base class
  Animal genericAnimal = new Animal("Generic");
  string name1 = genericAnimal.getName();
  string sound1 = genericAnimal.makeSound();

  // Test: Derived class
  Dog myDog = new Dog("Buddy", "Golden Retriever");
  string name2 = myDog.getName();        // Inherited
  string breed = myDog.getBreed();       // Own method
  string sound2 = myDog.makeSound();     // Overridden
  myDog.wagTail();                       // Dog-specific

  DebugN("Inheritance test completed");
}
