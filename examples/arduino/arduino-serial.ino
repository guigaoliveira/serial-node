void setup() 
{
   Serial.begin(9600);
   pinMode(13, OUTPUT);
}
void loop() 
{
  if(Serial.available())
  {
    char r = (char)Serial.read();
    if(r=='1')
    {
    digitalWrite(13,1);
    Serial.println("led on");
    }
    if(r=='0')
    {
    digitalWrite(13,0);
    Serial.println("led off");
    }
  }  
}
