---
title: Best practices for aws-cdk
subtitle: An opinionated view on how to work with Constructs
author: Matthew Keil
hero: static/media/ancient.jpg
prominent: false
published: 2021-05-18T02:30:38.132Z
updated: true
tags:
  - aws
  - aws-cdk
  - typescript
---

Best practices are opinions. And you know what they say about opinions? They are like assholes; everyone has one, but few pass the sniff test. So as long as that is the basis that we are building from feel free to take these and jazz them up to your own liking.

These are a flexible set of guidelines to help you on your journey with using the aws-cdk in production. When you have a rapid-fire development environment coordinating resources can be a challenge. Considering that multiple devs will be working on multiple branches, across multiple accounts we are going to need to be methodically to keep everyone running on the rails.

## Why?

There are many key aspects to a great DX, development experience and two that we will focus on here are consistency and comprehension. We don't write code for computers to read, we write code for other developers to read. When we are detailed in how we name our resources we will make our lives a lot easier.

This concept will carry us far beyond the code. By having consistency with how we structure our cdk Constructs we will enable ease of finding what we are looking for in the console. The AWS console is wonderful AND terrible. Its completely overwhelming for newcomers to the cloud realm and fiddling with it never gets easier. When you loathe "going into the console to touch stuff" you are officially a cloud pro. But that won't change the fact that you will need to go to the console. And when you do actually HAVE to go, the issue will be severe, because your Jr. has escalated this to you.... reluctantly.

That is when these details will have the **most** benefit. Being able to track down what is what will make your life easier from cradle to grave and we will hold each others' hands as we go down this path together. Just grit your teeth and know we will be better for it. Promise.

## What's in a name?

Physical resource id naming methodology is as contentious as tabs vs spaces <<waits for arguing to stop>>. And we all have our path along that journey. There are a few common points that everyone (mostly because they are dictated by the aws platform) agrees to. I learned quickly that kebab case was "the case" to use when building physical Id's. I found it easier to read than PascalCase and it is nice to differentiate the physicalId's from the logicalId's. When scripting the templates the second point is less important but the ease of readability is huge when one gets to the console. Trying to read function names in a huge long list of 50 character long PascalCased function names... it blurs the eyes. Search-ability is an important goal both for screen parsing and for the search box on each page of the console.

Which brings me to my next point. When I first started forming my "naming opinion" I looked at resource names in the context of all the other resource names. I wanted to be descriptive and call a spade a "spade." I called roles "_-role" and buckets "_-bucket". I figured that was the surest way to know what something was when I saw a long list of resource names. But I neglected unknowingly that I would never see "bucketNames" listed next the "functionNames" ever. Like never. One of the nicest parts of the aws console is that it doesn't really repeat itself much. It's pretty good when it comes to its UX such that resources are listed together as a group of that type of resource within a single view.

So when switching between views, there is no benefit to renaming the role, policy, function, logGroup differently (ie adding the '\*-type' suffix) and in fact you will get a visual detriment in the fact that the words will be "different" and the brain will have to reprocess as opposed to just pattern matching the last "name" it saw and looking for it again. By using the same "prefix" to denote all related resources its much easier for the brain to "pick the right one" out of a list of potentials.

So the task at hand for organizing our resources, both within our cdk constructs and within the console for debugging and analysis, is to come up with the perfect "prefix." The holy grail of logicalId naming. Yes, think Indiana Jones folks! It's that big! (the size of my devops nerd-out you ask?)

## The Prefix

There is a huge topic that we have yet to cover and it's resource naming collisions. If you've deployed your first stack for the second time, you know what I mean. Like 101 but possibly one of the most difficult parts to get right for large scale operations. You see when things get too verbose, naming get long and character limits start to kick in. The big one being 64 characters. Roles, policies, functions, and buckets all share that maximum. No more you say, then be better I say. This is what drove me to get rid of the '_-bucket' and '_-role' in the first place. Not the ease of reading. It was debugging for lots of large and challenging clients over the years that taught me the latter.

They key is to be precise enough to tell what stuff is but make sure its terse enough to fit. It also needs to accommodate branching strategies that occur during the normal development cycle. This is where I came up with the `${client}-${project}-${stage}` prefix idea. The client and project part is easy, most customers are repeat customers, and often they have multiple internal clients and projects. Being able to stand all of those stacks, and by reference resources in the same account means those two pieces need to always be there. The stage part is more for the development environment.

If one is using a prod account and a dev account the dev account will get a bit messy. A team development account is another great example of what I'm talking about. There are lots, and lots of branches in progress, and thus lots of stacks. This is when the `-${stage}` comes in handy. In one's own personal account there will come a time when you want to have a couple of branches built at once. A client may want a preview or a hobby can grow into a multi-environment animal.

##

Now that we have a nice prefix. Use it freely. Everywhere I tell you... Most importantly use it for the stack name. And everything within that stack, ideally, will have a physicalId (name) that starts with that stack name. Then pass around that prefix variable and it'll make a handy way to append on suffixes for more specific names, like functions. There are some things that we create that there will be many of per stack. Functions, log groups, roles, etc being a few examples. For those the way to name them is with a `${prefix}-thingy` name where "thingy" is the thingy you are trying to name.

As an example, to create a function, one needs to make a role, possibly a separate policy, a log group and the function itself. These things are all related to each other, support only each other, and should all share the same name. Ideally the function will have a file that it lives in and it, is called `doesSomethingFancy.ts`. Because we are expressive coders, we have named our function representatively of "what it does" and by extension as cloud coders we want to name our resources expressively. We want to correlate the fancy somethings and thusly

```typescript
const functionName = `${prefix}-does-something-fancy`
```

and now we will not only name our function with this but we will also name the log group, role, policy and anything else explicitly tied to the functionality of "doing something fancy" will will name it with the `-do-something-fancy` suffix.

(so we aren't messy and leaving log groups behind because the

easiest to they wouldn't clash.

to accept so I added a "-type" to the end of all my names of things
