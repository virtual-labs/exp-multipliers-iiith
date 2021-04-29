**Analog multiplier devices**

Analog multiplication can be accomplished by using the Hall Effect. Integrated circuits analog multipliers are incorporated into many applications, such as a true RMS converter, but a number of general purpose analog multiplier building blocks are available such as the Linear Four Quadrant Multiplier. General-purpose devices will usually include attenuators or amplifiers on the inputs or outputs in order to allow the signal to be scaled within the voltage limits of the circuit. Although analog multiplier circuits are very similar to operational amplifiers, they are far more susceptible to noise and offset voltage-related problems as these errors may become multiplied. When dealing with high frequency signals, phase-related problems may be quite complex. For this reason, manufacturing wide-range general-purpose analog multipliers is far more difficult than ordinary operational amplifiers, and such devices are typically produced using specialist technologies and laser trimming, as are those used for high-performance amplifiers such as instrumentation amplifiers. This means they have a relatively high cost and so they are generally used only for circuits where they are indispensable.


**Voltage-controlled amplifier versus analog multiplier**

If one input of an analog multiplier is held at a steady state voltage, a signal at the second input will be scaled in proportion to the level on the fixed input. In this case the analog multiplier may be considered to be a voltage controlled amplifier. Obvious applications would be for electronic volume control and automatic gain control. Although analog multipliers are often used for such applications, voltage-controlled amplifiers are not necessarily true analog multipliers. For example, an integrated circuit designed to be used as a volume control may have a signal input designed for 1 Vp-p, and a control input designed for 0-5 V dc; that is, the two inputs are not symmetrical and the control input will have a limited bandwidth. By contrast, in what is generally considered to be a true analog multiplier, the two signal inputs have identical characteristics. Applications specific to a true analog multiplier are those where both inputs are signals, for example in a frequency mixer or an analog circuit to implement a discrete Fourier transform. A four-quadrant multiplier is one where inputs and outputs may swing positive and negative. Many multipliers only work in 2 quadrants (one input may only have one polarity), or single quadrant (inputs and outputs have only one polarity, usually all positive).

Circuit Digram for 4 bits Shift register 

<img src="images/multi1.png">


Circuit Digram for Multiplication

<img src="images/multi2.png">
