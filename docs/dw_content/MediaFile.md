## Package: dw.content

# Class MediaFile

## Inheritance Hierarchy

- Object
  - dw.content.MediaFile

## Description

This class represents references to media content (such as images) located within Commerce Cloud Digital or on external systems. Parameter transform: Some methods allow the specification of image transformation parameters. Image transformation is only performed if the Dynamic Imaging Service (DIS) is available for the Commerce Cloud Digital instance, otherwise a standard static content URL is returned. The to-be-transformed image needs to be hosted on Commerce Cloud Digital. Image transformation parameters are specified as JavaScript object literal. They are translated into URL parameters. See Create Image Transformation URLs. Type of transformation Parameters Description Scale an image scaleWidth scaleHeight scaleMode The scaleWidth and scaleHeight parameters are both integers; setting one of these parameters triggers a scaling operation. If both are provided, the one that scales the image less is used to calculate the scale factor. The image is then automatically cropped accord to the second dimension, with a centered position of the cropped area. If the parameter would scale the image larger, only this operation is applied, if the image remains within acceptable pixel dimensions. Note: scaleMode can only be used in combination with scaleHeight and scaleWidth. The scaleMode parameter can be set to cut or fit. The default scaleMode is cut, the behavior of which is explained above. If you specify fit as the scaleMode, the system scales the image into the given box of dimensions while keeping the aspect ratio (possibly resulting in a smaller image in one dimension). Overlay an image imageX imageY imageURI The imageX and imageY parameters are both integers. Valid values for these parameters are 0 or greater. Supported formats are png, jpg, jp2, and gif. The imageURI parameter can be set to the absolute path of the overlaid image. The value of the imageURI parameter must be given in proper URL encoding, and it cannot exceed 400 characters in length. The path may include query string parameters, which supports dynamically generating the overlaid image itself through this service; that is, the overlaid image can itself be a transformed image. If the overlaid image extends over the primary image's boundaries, the overlaid image is cropped so that it fits directly over the primary image. Crop an image cropX cropY cropWidth cropHeight The cropX, cropY, cropWidth, cropHeight parameters are integers. All four parameters must be specified to trigger a cropping operation. Valid values for the cropX and cropY parameters are 0 or greater. If the crop location defined by cropX and cropY is outside the image area, nothing is cropped. Valid values for the cropWidth and cropHeight parameters are 10 or greater. If the cropWidth and cropHeight parameters specify a size that is greater than the original image, the crop area is reduced to the actual image area. If cropWidth and cropHeight are 0 or less, no transformation is applied. Format an image format The format parameter specifies the target format of image. Supported formats are png, jpg, jp2, and gif. If no target format is specified, no format conversion is performed. The attribute value must reference the source image. Source image's format is recognized by the file extension which must be tif, tiff, jpg, jpeg, png, or gif. In the generated URL the file extension of the target format is used in the URL path. This is to make sure the image is loaded from an URL with a matching file extension. The source format is provided as URL parameter. Adjust image compression quality quality The quality parameter specifies a quality setting for jpg and jp2 images, and specifies the compression level for png images. For jpg and jp2 images, you can set values from 1–100 for the highest quality. The default quality is 80. If you're not changing the default quality, you don't need to pass in a value. For png images, the quality setting has no effect on the appearance of the png, since the compression is always lossless. Instead you can use the quality setting to set the zlib compression level and filter-type for PNG images. The tens digit sets the zlib compression level(1-9). The ones digit sets the filter type. If the png setting is not present or set to 0, it uses a default value of 75. If this setting is set to 100, it actually equals the quality setting 90. Adjust Metadata stripping strip The strip parameter specifies if metadata like EXIF and color profiles is stripped from the image during transformation. Valid values for the strip parameter are between true and false. The default is true Change background color bgcolor(color) or bgcolor(color+alpha) The bgcolor parameter specifies the background color for images that support transparency as well as JPEG images when being converted from a format that supports transparency. Optionally, alpha setting for PNG images are also supported. bgcolor expects a 6 digit hexadecimal value of RGB with an optional two hexadecimal characters representing alpha value that determines transparency. FF0000 = Red FF000077 = Red with 50% transparency Alpha values are optional. When the alpha value is omitted, the resulting color is opaque. Alpha values are only valid when the image output format is PNG. Example: The following code var url = product.getImage('thumbnail', 0).getImageURL({scaleWidth: 100, format: 'jpg'}); will produce an image transformation URL like http://<image server host name>/.../on/demandware.static/.../<path to image>/image.jpg?sw=100&sfrm=png.

## Properties

### absURL

**Type:** URL (Read Only)

An absolute URL to the referenced media file. The
 protocol for the reference is the current protocol of the current
 HTTP request.

### alt

**Type:** String (Read Only)

The alternative text assigned to the media file in current
 requests locale. If no alternative text was assigned or if no defaulting
 rule was defined, the method returns null.

### httpsURL

**Type:** URL (Read Only)

An absolute URL to the referenced media file. The
 protocol is https.

### httpURL

**Type:** URL (Read Only)

An absolute URL to the referenced media file. The
 protocol is http.

### title

**Type:** String (Read Only)

The title assigned to the media file in current requests locale.
 If no title was assigned or if no defaulting rule was defined, the
 method returns null.

### url

**Type:** URL (Read Only)

An URL to the referenced media file. The
 returned URL is a relative URL.

### URL

**Type:** URL (Read Only)

An URL to the referenced media file. The
 returned URL is a relative URL.

### viewType

**Type:** String (Read Only)

The view type annotation for the media file. The method returns
 null, if the media file has no view type annotation.

## Constructor Summary

## Method Summary

### getAbsImageURL

**Signature:** `getAbsImageURL(transform : Object) : URL`

Returns an URL to the referenced image file.

### getAbsURL

**Signature:** `getAbsURL() : URL`

Returns an absolute URL to the referenced media file.

### getAlt

**Signature:** `getAlt() : String`

Returns the alternative text assigned to the media file in current requests locale.

### getHttpImageURL

**Signature:** `getHttpImageURL(transform : Object) : URL`

Returns an URL to the referenced image file.

### getHttpsImageURL

**Signature:** `getHttpsImageURL(transform : Object) : URL`

Returns an URL to the referenced image file.

### getHttpsURL

**Signature:** `getHttpsURL() : URL`

Returns an absolute URL to the referenced media file.

### getHttpURL

**Signature:** `getHttpURL() : URL`

Returns an absolute URL to the referenced media file.

### getImageURL

**Signature:** `getImageURL(transform : Object) : URL`

Returns an URL to the referenced image file.

### getTitle

**Signature:** `getTitle() : String`

Returns the title assigned to the media file in current requests locale.

### getUrl

**Signature:** `getUrl() : URL`

Returns an URL to the referenced media file.

### getURL

**Signature:** `getURL() : URL`

Returns an URL to the referenced media file.

### getViewType

**Signature:** `getViewType() : String`

Returns the view type annotation for the media file.

## Method Detail

## Method Details

### getAbsImageURL

**Signature:** `getAbsImageURL(transform : Object) : URL`

**Description:** Returns an URL to the referenced image file. Image transformation can be applied to the image. The protocol for the reference is the current protocol of the current HTTP request. Image transformation can only be applied to images that are hosted on Commerce Cloud Digital.

**Parameters:**

- `transform`: Object with transformation parameters (see class header)

**Returns:**

an absolute URL to the referenced media file. The protocol for the reference is the current protocol of the current HTTP request. If the referenced media file is hosted externally, an URL to the external file is returned.

---

### getAbsURL

**Signature:** `getAbsURL() : URL`

**Description:** Returns an absolute URL to the referenced media file. The protocol for the reference is the current protocol of the current HTTP request.

**Returns:**

an absolute URL to the referenced media file. The protocol for the reference is the current protocol of the current HTTP request.

---

### getAlt

**Signature:** `getAlt() : String`

**Description:** Returns the alternative text assigned to the media file in current requests locale. If no alternative text was assigned or if no defaulting rule was defined, the method returns null.

**Returns:**

the alternative text annotated to this media file or null

---

### getHttpImageURL

**Signature:** `getHttpImageURL(transform : Object) : URL`

**Description:** Returns an URL to the referenced image file. Image transformation can be applied to the image. The protocol is http. Image transformation can only be applied to images that are hosted on Commerce Cloud Digital.

**Parameters:**

- `transform`: Object with transformation parameters (see class header)

**Returns:**

an absolute URL to the referenced media file. The protocol is http. If the referenced media file is hosted externally, an URL to the external file is returned.

---

### getHttpsImageURL

**Signature:** `getHttpsImageURL(transform : Object) : URL`

**Description:** Returns an URL to the referenced image file. Image transformation can be applied to the image. The protocol is https. Image transformation can only be applied to images that are hosted on Commerce Cloud Digital.

**Parameters:**

- `transform`: Object with transformation parameters (see class header)

**Returns:**

an absolute URL to the referenced media file. The protocol is https. If the referenced media file is hosted externally, an URL to the external file is returned.

---

### getHttpsURL

**Signature:** `getHttpsURL() : URL`

**Description:** Returns an absolute URL to the referenced media file. The protocol is https.

**Returns:**

an absolute URL to the referenced media file. The protocol is https.

---

### getHttpURL

**Signature:** `getHttpURL() : URL`

**Description:** Returns an absolute URL to the referenced media file. The protocol is http.

**Returns:**

an absolute URL to the referenced media file. The protocol is http.

---

### getImageURL

**Signature:** `getImageURL(transform : Object) : URL`

**Description:** Returns an URL to the referenced image file. Image transformation can be applied to the image. Image transformation can only be applied to images that are hosted on Commerce Cloud Digital.

**Parameters:**

- `transform`: Object with transformation parameters (see class header)

**Returns:**

an URL to the referenced media file. The returned URL is a relative URL. If the referenced media file is hosted externally, an URL to the external file is returned.

---

### getTitle

**Signature:** `getTitle() : String`

**Description:** Returns the title assigned to the media file in current requests locale. If no title was assigned or if no defaulting rule was defined, the method returns null.

**Returns:**

the title annotated to this media file or null

---

### getUrl

**Signature:** `getUrl() : URL`

**Description:** Returns an URL to the referenced media file. The returned URL is a relative URL.

**Deprecated:**

Use getURL() instead.

**Returns:**

an URL to the referenced media file. The returned URL is a relative URL.

---

### getURL

**Signature:** `getURL() : URL`

**Description:** Returns an URL to the referenced media file. The returned URL is a relative URL.

**Returns:**

an URL to the referenced media file. The returned URL is a relative URL.

---

### getViewType

**Signature:** `getViewType() : String`

**Description:** Returns the view type annotation for the media file. The method returns null, if the media file has no view type annotation.

**Returns:**

the view type annotated to this media file or null

---