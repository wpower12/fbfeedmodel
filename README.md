## FBFeedModel
This project is an attempt to illustrate the power of network effects on the development and evolution of a users opinion. Specifically, how choices by network maintainers/owners can dramatically effect the distribtions of opinions.

This work assumes a very simple model of opinion dynamics, based on a combination of ideas from independant cascade models, and models with perceptron-like opinion updates. 

Each iteration, users sample new 'articles' from a set of news outlets. These outlets are defined by a mean, and std var within the 'opinion space', which in this case is simply the subset of the reals; [-1, 1]. Opinions of users are also defined as values in this range. 

After selecting new 'articles' from these outlets, users also sample the 'old feeds' of other their neighbors in the social graph. 

The goal is to expose all of the latent parameters of all the actions described above, with addtional controls representing the ability of the network maintainer to selectivly (based on opinion value) manipulate these choices/sampleings. 

The current working version can (should) be found [here](https://www.poweriii.com/projects/fbfeed.html).