## Futureboare IO for Makecode Arcade

This extension provides a set of blocks to interact with the Futureboard peripheral for Makecode Arcade.

![image](https://github.com/user-attachments/assets/6bbd938b-581b-4385-9fe4-c13a0645199b)


## How to use

### Upgrading the firmware of Futureboard lite

1. Download the firmware from the [releases page]()

2. Double press the reset button on the Futureboard lite to enter the bootloader mode. The RGB led will turn green. And there will be a new drive called `UF2_Future` on your computer.

3. Copy the firmware file to the `UF2_Future` drive. The RGB led will turn red and then green again when the firmware is successfully flashed.

### Enable the VM Device in Makecode Arcade

* Go to `Settings` -> `About` -> `Experimental` and enable the `Experimental hardware` option.

Select the `VM` target in the hardware section before downloading games.

After that, you can download any arcade game to the Futureboard lite. The file extension should be `.pxt64`.


## Load the extension in Makecode Arcade
![image](https://github.com/user-attachments/assets/c0e1bf2e-6ba6-463c-87a5-ea4fe4935357)

* Click on the `Extensions` button and enter the github url of this repository.

```
https://github.com/KittenBot/pxt-futureboard.git
```

Have fun! Any feedback is welcome!
